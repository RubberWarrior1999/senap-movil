// Run against an exported web build using a locally available Playwright installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.SENAP_PLAYWRIGHT || 'playwright');

const dist = path.resolve(__dirname, '..', process.env.SENAP_WEB_DIST || 'dist');
const adminEmail = process.env.EXPO_PUBLIC_DEMO_ADMIN_EMAIL?.trim().toLowerCase() || 'admin@senap.test';
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
    args: ['--disable-logging'],
    headless: true,
  });
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
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
    page.setDefaultTimeout(12000);
    const shown = text => page.getByText(text, { exact: true }).filter({ visible: true }).first().waitFor();
    const button = name => page.getByRole('button', { name, exact: typeof name === 'string' });
    const heading = name => page.getByRole('heading', { name, exact: true }).waitFor();
    const field = label => page.getByRole('textbox', { name: label, exact: true });
    const fill = (label, value) => page.getByLabel(label, { exact: true }).fill(value);
    const selectTab = path => page.locator(`a[href="${path}"]:visible`).first().click();
    const login = async (username, password) => {
      await fill('Usuario', username);
      await fill('Contraseña', password);
      await button('Entrar').click();
    };
    const checkWidth = async () => assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      true,
      'La vista debe caber sin desplazamiento horizontal',
    );

    await page.goto(url + '/usuarios/nuevo');
    await heading('Iniciar sesión');
    for (const credential of ['Cuenta de demostración', 'admin.demo', 'SenapDemo21', adminEmail]) {
      assert.equal(await page.getByText(credential, { exact: false }).filter({ visible: true }).count(), 0);
    }
    await checkWidth();
    await shot('01-login');
    await field('Usuario').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('aria-label'), 'Contraseña');
    await login('admin.demo', 'incorrecta');
    await shown('El usuario o la contraseña no son válidos.');
    await button('Olvidé mi contraseña').click();
    await heading('Recuperar contraseña');
    await fill('Correo registrado', 'invalido');
    await button('Solicitar código').click();
    await shown('Introduce un correo válido.');
    await fill('Correo registrado', adminEmail);
    await button('Solicitar código').click();
    await heading('Verificar código');
    assert.equal(await page.getByText('482615').filter({ visible: true }).count(), 0);
    await fill('Código de verificación', '000000');
    await button('Verificar código').click();
    await shown('El código no es válido.');
    await fill('Código de verificación', '482615');
    await button('Verificar código').click();
    await heading('Nueva contraseña');
    await fill('Nueva contraseña', 'DemoCambio21');
    await fill('Confirmar contraseña', 'otra');
    await button('Guardar contraseña').click();
    await shown('Las contraseñas no coinciden.');
    await fill('Confirmar contraseña', 'DemoCambio21');
    await button('Guardar contraseña').click();
    await heading('Iniciar sesión');
    await shown('Contraseña actualizada en la demostración.');
    await login('admin.demo', 'SenapDemo21');
    await shown('El usuario o la contraseña no son válidos.');
    await login('admin.demo', 'DemoCambio21');
    await heading('Panel principal');
    await shown('Hola, Juan Sanchez.');
    await shown('44,5 L');
    await checkWidth();
    await shot('02-panel');
    console.log('OK Login y recuperación: ruta protegida, teclado, rechazos, cambio de contraseña y acceso.');

    await button('Abrir Usuarios').click();
    await heading('Usuarios');
    await button('Nuevo usuario').click();
    await heading('Nuevo usuario');
    await fill('Nombre completo', 'Rosa Prueba');
    await fill('Nombre de usuario', 'admin.demo');
    await fill('Correo electrónico', 'invalido');
    await button('Guardar usuario').click();
    await shown('El nombre de usuario ya existe.');
    await shown('Introduce un correo válido.');
    await shown('Usa al menos 6 caracteres.');
    await fill('Nombre de usuario', 'rosa.demo');
    await fill('Correo electrónico', 'rosa@senap.test');
    await fill('Contraseña de demostración', 'RosaDemo21');
    await checkWidth();
    await shot('03-formulario-usuario');
    await button('Guardar usuario').click();
    await heading('Usuarios');
    await shown('Usuario creado.');
    await button('Editar a Rosa Prueba').click();
    await button('Moderador').click();
    await button('Inactiva').click();
    await button('Guardar usuario').click();
    await shown('Usuario actualizado.');
    await button('Inactivos').click();
    await fill('Buscar usuarios', 'rosa.demo');
    await shown('rosa.demo · Moderador');
    await button('Eliminar a Rosa Prueba').click();
    await heading('Eliminar usuario');
    await button('Cancelar').click();
    await shown('Rosa Prueba');
    await button('Eliminar a Rosa Prueba').click();
    await button('Confirmar eliminación').click();
    await shown('Usuario eliminado.');
    await shown('Sin usuarios para esta búsqueda');
    await button('Todos').click();
    await fill('Buscar usuarios', 'admin.demo');
    await button('Editar a Juan Sanchez').click();
    await button('Inactiva').click();
    await button('Guardar usuario').click();
    await shown('Debe quedar al menos un administrador activo.');
    await button('Cancelar').click();
    console.log('OK Usuarios: validaciones, alta, edición, búsqueda, eliminación confirmada y protección del administrador.');

    await selectTab('/animales');
    await heading('Animales');
    await fill('Buscar animales', 'no existe');
    await shown('Sin animales para esta búsqueda');
    await fill('Buscar animales', 'Moro');
    await button('Ver ficha de Moro').click();
    await heading('Ficha de Moro');
    assert.equal(await button('Registrar ordeño').count(), 0);
    await button('Atrás').click();
    await button('Nuevo animal').click();
    await heading('Nuevo animal');
    await fill('Código del animal', 'BOV-001');
    await fill('Nombre del animal', 'Luna');
    await button('Holstein').click();
    await button('Bufalino').click();
    assert.equal(await button('Holstein').count(), 0);
    await button('Guardar ficha').click();
    await shown('Ya existe un animal con ese código.');
    await shown('Selecciona una raza de la especie elegida.');
    await fill('Código del animal', 'BOV-006');
    await button('Bovino').click();
    await button('Holstein').click();
    await button('Potrero Norte').click();
    await button('Guardar ficha').click();
    await heading('Ficha de Luna');
    await shown('Animal registrado.');
    await button('Editar ficha').click();
    await heading('Editar ficha');
    await fill('Observaciones', 'Observación de prueba');
    await button('Guardar ficha').click();
    await heading('Ficha de Luna');
    await shown('Observación de prueba');
    await shot('04-ficha-animal');
    console.log('OK Animales: búsqueda, código único, dependencia especie-raza, alta y edición.');

    await button('Registrar ordeño').click();
    await heading('Registrar ordeño');
    assert.equal(await button('Luna · BOV-006').getAttribute('aria-pressed'), 'true');
    assert.equal(await button('Moro · BOV-004').count(), 0);
    const today = await field('Fecha').inputValue();
    await fill('Fecha', '2099-01-01');
    await fill('Litros', '0');
    await button('Guardar registro').click();
    await shown('La fecha no puede ser posterior a hoy.');
    await shown('Introduce litros mayores que cero, con hasta dos decimales.');
    await fill('Fecha', today);
    await fill('Litros', '8,5');
    await button('Buena').click();
    await button('Guardar registro').click();
    await heading('Producción de leche');
    await shown('Ordeño registrado.');
    await shown('53 L');
    await checkWidth();
    await shot('05-leche');
    await button('Todas las fechas').click();
    await shown('64 L');
    await fill('Buscar por animal', 'BOV-006');
    const milking = button(/^Ver ordeño de Luna/);
    await milking.click();
    await heading('Detalle del ordeño');
    await button('Eliminar registro').click();
    await button('Cancelar').click();
    await button('Cerrar').click();
    await shown('8,5 L');
    await selectTab('/');
    await heading('Panel principal');
    await shown('53 L');

    await selectTab('/reportes');
    await heading('Reportes');
    await shown('53 L');
    await button('Últimos 7 días').click();
    await shown('64 L');
    await button('Hoy').click();
    await shown('53 L');
    await checkWidth();
    await shot('07-reportes');
    const milkPreviewPromise = page.waitForEvent('popup');
    await button('Exportar PDF').click();
    const milkPreview = await milkPreviewPromise;
    await milkPreview.getByRole('heading', { name: 'Producción de leche' }).waitFor();
    assert.match(await milkPreview.locator('header').innerText(), /Filtro aplicado: Hoy/);
    assert.equal(await milkPreview.locator('tbody tr').count(), 4);
    assert.match(await milkPreview.locator('body').innerText(), /53 L/);
    await milkPreview.pdf({
      path: path.join(preview, 'reporte-leche.pdf'), preferCSSPageSize: true, printBackground: true,
    });
    await milkPreview.close();

    await button('Animales').click();
    await heading('Inventario de animales');
    await button('Otros estados').click();
    await shown('Brisa');
    assert.equal(await page.getByText('Canela', { exact: true }).filter({ visible: true }).count(), 0);

    await button('Usuarios').click();
    await heading('Usuarios y roles');
    await button('Inactivos').click();
    await shown('María Torres');
    const userPreviewPromise = page.waitForEvent('popup');
    await button('Exportar PDF').click();
    const userPreview = await userPreviewPromise;
    await userPreview.getByRole('heading', { name: 'Usuarios y roles' }).waitFor();
    const userReport = await userPreview.locator('body').innerText();
    assert.match(userReport, /María Torres/);
    assert.doesNotMatch(userReport, /@|SenapDemo21|admin\.demo/);
    await userPreview.close();

    await button('Sanidad').click();
    await heading('Controles sanitarios');
    await button('Pendientes').click();
    await shown('Control posvacunación');
    await button('Jornadas').click();
    await heading('Tareas de la jornada');
    await button('Completadas').click();
    await shown('Revisar bebederos');
    console.log('OK Reportes: cinco módulos, filtros, total actualizado y PDF sin credenciales.');

    await selectTab('/');
    await heading('Panel principal');
    await button('Abrir Producción de leche').click();
    await milking.click();
    await button('Eliminar registro').click();
    await button('Confirmar eliminación').click();
    await shown('Registro de ordeño eliminado.');
    await selectTab('/');
    await heading('Panel principal');
    await shown('44,5 L');
    console.log('OK Leche y Dashboard: ficha vinculada, validaciones, filtros, total compartido y eliminación confirmada.');

    await button('Abrir Sanidad').click();
    await heading('Sanidad');
    await button(/Control posvacunación/).click();
    await button('Marcar como realizado').click();
    await shown('1 control pendiente');
    await button('Atrás').click();
    await button('Abrir Jornadas').click();
    await heading('Jornadas');
    const task = page.getByRole('checkbox', { name: 'Registrar ordeño de la mañana' });
    await task.click();
    assert.equal(await task.getAttribute('aria-checked'), 'true');
    await button('Atrás').click();
    await page.setViewportSize({ width: 1024, height: 780 });
    await checkWidth();
    await shot('06-panel-ancho');
    await button('Cerrar sesión').click();
    await heading('Iniciar sesión');
    await page.goBack();
    await heading('Iniciar sesión');
    await login('campo.demo', 'CampoDemo21');
    await heading('Panel principal');
    assert.equal(await button('Abrir Usuarios').count(), 0);
    await selectTab('/reportes');
    await heading('Reportes');
    assert.equal(await button('Usuarios').count(), 0);
    await page.reload();
    await heading('Iniciar sesión');
    assert.deepEqual(external, []);
    assert.deepEqual(errors, []);
    console.log('OK Acceso, diseño adaptable y módulos previos: salida, cuenta limitada, recarga, Sanidad y Jornadas. Cero peticiones externas.');
  } finally {
    await browser.close();
  }
}

smoke().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => server.close());
