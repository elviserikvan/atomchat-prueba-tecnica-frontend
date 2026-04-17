# Technical Challenge Frontend

Frontend del challenge técnico construido con Angular 17.

## Funcionalidades

- Login por correo con creación automática de usuario
- Login con Google via Firebase
- Gestión de tareas: crear, editar, eliminar y filtrar
- Cambio de estado de tarea
- Paginación
- Guards de autenticación
- Storage encapsulado

## Stack

- Angular 17
- TypeScript
- Reactive Forms
- Lazy loading
- Firebase Web SDK
- Bootstrap
- ESLint + Husky + lint-staged

## Arquitectura

- Angular modular con lazy loading
- Separación `core` / `ui`
- Guards para rutas protegidas
- Servicios HTTP encapsulados
- Enums, interfaces y constantes compartidas
- Theming global centralizado en `src/styles.scss`

## Decisiones técnicas

- La sesión usa el token propio del backend para no depender del estado interno de Firebase Auth.
- Las opciones de estado se centralizaron en constantes tipadas para evitar strings quemados en templates.
- El tema visual usa variables CSS en `styles.scss` para consistencia de colores, superficies y botones.
- Se aplicaron atributos ARIA, labels asociados y regiones vivas para accesibilidad.
- La paginación y el filtro por estado se delegan a la API para mantener la vista simple y escalable.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Scripts

```bash
npm start
npm run build
```

## Estructura

- `src/app/core` — servicios, guards, interfaces, constantes, enums
- `src/app/ui` — componentes y vistas
- `src/environment` — configuración de entorno

## Flujo principal

1. El usuario entra con correo.
2. Si no existe, el frontend confirma la creación.
3. El backend emite un JWT.
4. El frontend guarda la sesión y consume endpoints protegidos.

## Login con Google

El proyecto soporta login con Google como funcionalidad adicional:

1. Autenticación en Firebase desde Angular.
2. Obtención del `idToken`.
3. Envío al backend para validación.
4. El backend emite su propio JWT.
