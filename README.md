# SENAP Móvil

Prototipo de interfaz para Electiva III. Usa React Native, Expo SDK 57, Expo Router y TypeScript. Incluye una vista web para ensayar la exposición.

## Recorridos de la evaluación

| Vista | Interacción |
| --- | --- |
| Login | Accede con una cuenta activa de ejemplo. Al cerrar sesión, las pantallas principales vuelven a exigir acceso. |
| Recuperación | Verifica correo y código de prueba, confirma una nueva contraseña y úsala para ingresar durante la misma ejecución. |
| Dashboard | Muestra animales activos, litros del día, usuarios activos para el administrador y accesos a los módulos. |
| Usuarios | Busca y filtra cuentas. Registra, edita y elimina con validaciones, roles, estados y confirmación dentro de la app. |
| Animales | Busca por nombre, código, raza o lote. Filtra por estado y abre, crea o edita fichas. |
| Producción de leche | Registra ordeños de hembras activas, consulta litros por animal y período, revisa el gráfico semanal y elimina con confirmación. |

Sanidad y Jornadas siguen accesibles desde el Dashboard. El tema azul y blanco aplica a todos los recorridos.

Las cuentas y los permisos están simulados. Los cambios se conservan en memoria al navegar y vuelven al estado inicial al recargar la app. Todo el recorrido funciona sin XAMPP, base de datos, correo ni API.

| Cuenta de prueba | Usuario | Contraseña inicial |
| --- | --- | --- |
| Administradora | `admin.demo` | `SenapDemo21` |
| Campo, con acceso limitado | `campo.demo` | `CampoDemo21` |

Para recuperar la primera cuenta, usa su correo asociado y el código ficticio `482615`. Por defecto, el correo es `admin@senap.test`. Puedes indicar otro en `EXPO_PUBLIC_DEMO_ADMIN_EMAIL` dentro de `.env.local` y recargar la app. El valor forma parte de la copia de demostración que sirve Expo.

## Arranque en Windows

Abre esta carpeta en VS Code. Si recibiste el ZIP, extráelo a una carpeta local antes de continuar.

```powershell
npm.cmd ci
npm.cmd start
```

La instalación inicial necesita acceso a npm si los paquetes aún no están en caché. Una vez instalados, `npm.cmd start` ejecuta Expo con `--offline`. Para la demostración por USB, sigue los pasos de la sección Android por USB.

Para ensayar desde la PC usa `npm.cmd run web`. Para revisar TypeScript usa `npm.cmd run typecheck`.

### Android por USB

Con Expo Go para SDK 57 instalado, activa la depuración USB y acepta el aviso del teléfono al conectarlo. Agrega a `PATH` de esa terminal la carpeta que contiene `adb.exe`. Desde la carpeta del proyecto, con un solo dispositivo conectado:

```powershell
adb devices
adb reverse tcp:8081 tcp:8081
.\node_modules\.bin\expo.cmd start --offline --port 8081
```

Comprueba que el teléfono figure como `device` y pulsa `a` en la terminal de Expo. Si ya tienes un emulador disponible, arráncalo antes de ejecutar Expo y usa la misma tecla para abrir el proyecto.

## Guion de demostración

1. Intenta entrar con una clave incorrecta. Ejecuta recuperación e ingresa con la nueva clave.
2. Desde **Usuarios**, intenta guardar un correo inválido y luego crea una cuenta de prueba. Cambia su rol o estado.
3. Desde **Animales**, busca a **Canela**, abre su ficha y selecciona **Registrar ordeño**. El formulario abre con ese animal ya seleccionado.
4. Intenta guardar **0 L**. Corrige a **8,5 L** y verifica que **Producción de leche** y **Panel** muestran **53 L** para el día.
5. Cierra sesión y comprueba que el flujo regresa a **Iniciar sesión**.

## Organización del código

- `src/app/` contiene los grupos de rutas de acceso y de la aplicación.
- `src/features/` organiza las pantallas, las reglas y los datos iniciales por módulo.
- `src/components/` contiene controles compartidos, etiquetas, mensajes, estados vacíos y formularios desplazables.
- `src/services/` mantiene el estado simulado. `src/theme.ts` define la paleta y `assets/` conserva los iconos locales.

## Verificación

`scripts/smoke-web.cjs` ejecuta los recorridos en Chromium sobre una exportación web local. Requiere Playwright disponible aparte. Las variables `SENAP_WEB_DIST`, `SENAP_PLAYWRIGHT` y `SENAP_CHROMIUM` permiten indicar la carpeta exportada, el módulo y el ejecutable de navegador en ese orden. La demostración en un teléfono conectado o emulador se comprueba aparte.

Referencia de arranque y uso con dispositivos: [Expo](https://docs.expo.dev/get-started/start-developing/).
