# SENAP Móvil

Prototipo de frontend para Electiva III. Usa React Native, Expo SDK 57 y Expo Router con el mismo código para Android e iOS. Incluye una vista web para ensayar la exposición.

## Cinco vistas

| Vista | Interacción |
| --- | --- |
| Inicio | Resume ganado, controles sanitarios, leche y tareas. Los indicadores se actualizan al cambiar datos en otras vistas. |
| Ganado | Busca por nombre, código, raza o potrero. Filtra por estado y abre la ficha del animal. |
| Sanidad | Filtra controles, consulta su detalle y marca un control como realizado. |
| Producción | Registra o actualiza litros por animal y turno. Valida la cantidad y recalcula el gráfico y el total. |
| Jornadas | Filtra tareas, marca o desmarca su cumplimiento y muestra el avance de la jornada. |

Los datos son ficticios. Se mantienen en memoria al navegar y regresan a su estado inicial al recargar la app. En esta entrega el frontend funciona sin XAMPP, base de datos ni conexión a una API.

## Arranque en Windows

Abre esta carpeta en VS Code. Si recibiste el ZIP, extráelo a una carpeta local antes de continuar.

```powershell
npm.cmd ci
npm.cmd start
```

La instalación inicial necesita acceso a npm si los paquetes aún no están en caché. Una vez instalados, `npm.cmd start` ejecuta Expo en modo local con `--offline --lan`. Conecta el teléfono y la PC a la misma red, abre el QR en Expo Go compatible con SDK 57 y haz una prueba con el dispositivo antes de clase. El hotspot puede proporcionar esa red local sin conexión a Internet si permite el tráfico entre ambos dispositivos.

Para ensayar desde la PC usa `npm.cmd run web`. Para revisar TypeScript usa `npm.cmd run typecheck`.

## Guion de demostración

1. En **Inicio**, muestra los cuatro indicadores.
2. En **Ganado**, filtra por seguimiento, busca a **Lucero** y abre su ficha.
3. En **Sanidad**, completa el control posvacunación. El resumen baja de dos pendientes a uno.
4. En **Producción**, abre **Registrar ordeño**, deja **Canela / Tarde** y prueba primero con cero para mostrar la validación. Guarda **8,5 L** y comprueba que el total sube de **44,5 a 53 L**.
5. En **Jornadas**, marca la tarea del ordeño y comprueba que el avance pasa de **25 % a 50 %**. Vuelve a **Inicio** para ver los cambios reflejados.

## Organización del código

- `src/app/` contiene las cinco rutas y la barra de navegación.
- `src/components/` contiene los elementos compartidos entre vistas.
- `src/services/` contiene los datos ficticios y el estado de la sesión de demostración. En el próximo trayecto será el punto de integración para la API.
- `src/utils/` contiene la validación de litros y `src/theme.ts` define la paleta.
- `assets/` contiene la ilustración y los iconos locales. Los PNG ya están incluidos.

## Verificación

TypeScript y la exportación de Expo para Android, iOS y web pasaron. El recorrido funcional se probó en Chromium con tamaño de teléfono y las solicitudes externas bloqueadas. Queda pendiente escanear el QR y probar la app en teléfonos Android e iOS.

Referencia de arranque y uso con dispositivos: [Expo](https://docs.expo.dev/get-started/start-developing/).
