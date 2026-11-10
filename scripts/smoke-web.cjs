// Run against an exported web build using a locally available Playwright installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.SENAP_PLAYWRIGHT || 'playwright');

const dist = path.resolve(__dirname, '../dist');
const preview = path.resolve(dist, 'qa');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let filename = path.resolve(dist, '.' + pathname);
  if (filename !== dist && !filename.startsWith(dist + path.sep)) {
    response.writeHead(404).end();
    return;
  }
  if (!fs.existsSync(filename) || fs.statSync(filename).isDirectory()) {
    filename = path.join(dist, 'index.html');
  }
  response.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
  fs.createReadStream(filename).pipe(response);
});

async function smoke() {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({
    ...(process.env.SENAP_CHROMIUM ? { executablePath: process.env.SENAP_CHROMIUM } : {}),
    headless: true,
  });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const external = [];
    await context.route('**/*', route => {
      if (route.request().url().startsWith(url + '/')) return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    fs.mkdirSync(preview, { recursive: true });
    const shot = name => page.screenshot({ path: path.join(preview, name + '.png') });
    const shown = text => page.getByText(text, { exact: true }).first().waitFor();
    const button = name => page.getByRole('button', { name });
    const go = async (route, heading) => {
      await page.locator(`a[href="/${route}"]`).last().click();
      await page.getByRole('heading', { name: heading }).waitFor();
    };
    await page.goto(url);
    await shown('Vista general');
    await page.waitForLoadState('networkidle');
    await shot('01-inicio');
    await button('Abrir Ganado').click();
    await page.getByRole('heading', { name: 'Ganado' }).waitFor();
    await shot('02-ganado');
    await button('Seguimiento').click();
    await page.getByLabel('Buscar animal').fill('BOV-002');
    await button('Ver ficha de Lucero').click();
    await shown('Ficha de Lucero');
    await shown('Hembra · 412 kg');
    await button('Cerrar').click();
    await page.getByLabel('Buscar animal').fill('sin coincidencias');
    await shown('No encontramos animales con esos filtros.');
    console.log('OK Ganado: búsqueda, filtro, ficha y estado vacío.');

    await go('sanidad', 'Sanidad');
    await shot('03-sanidad');
    await shown('2 controles pendientes');
    await button(/Control posvacunación/).click();
    await button('Marcar como realizado').click();
    await shown('1 control pendiente');
    await button('Realizados').click();
    await shown('Control posvacunación');
    console.log('OK Sanidad: cambio de estado y filtro.');

    await go('produccion', 'Producción');
    await shot('04-produccion');
    await button('Registrar ordeño').click();
    await page.getByLabel('Litros', { exact: true }).fill('0');
    await button('Guardar registro').click();
    await page.getByRole('alert').waitFor();
    await page.getByLabel('Litros', { exact: true }).fill('8,5');
    await button('Guardar registro').click();
    await shown('Ordeño registrado en la demo.');
    await shown('53 L');
    await button('Registrar ordeño').click();
    await page.getByLabel('Litros', { exact: true }).fill('10,5');
    await button('Actualizar registro').click();
    await shown('55 L');
    await shown('4 registros de ordeño');
    console.log('OK Producción: validación, alta y edición sin duplicados.');

    await go('jornadas', 'Jornadas');
    await shot('05-jornadas');
    const task = page.getByRole('checkbox', { name: 'Registrar ordeño de la mañana' });
    await shown('25%');
    await task.click();
    await shown('50%');
    assert.equal(await task.getAttribute('aria-checked'), 'true');
    await button('Completadas').click();
    assert.equal(await page.getByRole('checkbox').count(), 2);
    await go('', 'Tu finca, al día.');
    await shown('55 L');
    await shown('2 / 4');
    assert.deepEqual(external, []);
    assert.deepEqual(errors, []);
    console.log('OK Jornadas e Inicio: avance compartido, cinco rutas y ninguna petición externa.');
  } finally {
    await browser.close();
  }
}

smoke().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => server.close());
