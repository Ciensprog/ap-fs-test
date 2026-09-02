# Alto Porte - Prueba Técnica Full Stack Developer

Este repositorio contiene la solución completa orientada al desarrollo frontend, arquitectura y análisis técnico para el **Módulo de Seguimiento de Leads Inmobiliarios** de Alto Porte.

---

## 🚀 Requisitos Previos y Entorno

- **Node.js**: v18.x o superior (recomendado Node.js LTS).
- **npm**: v9.x o v10.x.
- **Angular CLI**: v16.2.0 (`npm install -g @angular/cli@16`).
- **MongoDB** (Opcional para backend real): v6.0+ o contenedor Docker.

---

## 🛠️ Pasos de Instalación y Ejecución

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repositorio>
cd ap-fs-test
npm install
```

### 2. Variables de Entorno

Cree un archivo `.env` a partir del archivo `.env.example` en la raíz del proyecto:

```bash
cp .env.example .env
```

Contenido de referencia en `.env.example`:

```env
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000/api
USE_MOCK_FALLBACK=true
```

### 3. Iniciar la Aplicación Frontend

Para ejecutar el servidor de desarrollo de Angular:

```bash
npm start
# O alternativamente:
ng serve --open
```

Acceda a la aplicación en su navegador: `http://localhost:4200`

---

## 🧪 Pruebas Automatizadas

La aplicación cuenta con pruebas unitarias desarrolladas en Jasmine y Karma que validan el comportamiento reactivo de los formularios, las llamadas al servicio HTTP y la renderización del dashboard.

Para ejecutar la suite de pruebas unitarias:

```bash
npm test
```

Para ejecutar las pruebas en modo de integración continua (ejecución única en headless):

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

---

## 📐 Arquitectura de la Solución

### Arquitectura de Frontend (Angular 16)

Se utilizó una estructura **modular y basada en capas de responsabilidad**, orientada a escalabilidad y mantenibilidad:

```
src/
├── app/
│   ├── core/                      # Servicios centrales, interceptores y modelos
│   │   ├── models/                # Interfaces TypeScript (Lead, DashboardSummary, Filters)
│   │   └── services/              # LeadService con lógica RxJS y fallback de resiliencia
│   ├── features/                  # Módulos y componentes de negocio
│   │   └── leads/
│   │       └── components/
│   │           ├── metrics-overview/  # Tarjetas KPI (Total, Promedio, Conversión, Reservados) y desgloses
│   │           ├── lead-filter/       # Controles de filtrado, búsqueda y ordenamiento
│   │           ├── lead-form/         # Formulario Reactivo (ReactiveFormsModule) con validaciones
│   │           └── lead-list/         # Tabla responsiva, badges, paginación y cambio de estado
│   ├── app-routing.module.ts
│   ├── app.component.*
│   └── app.module.ts
├── assets/
├── environments/                  # Variables de entorno por ambiente (dev / prod)
└── styles.css                     # Sistema de diseño CSS global y tipografía Inter
```

#### Razón de la Elección de la Estructura y Escalabilidad

1. **Separación de Responsabilidades**: Los componentes UI son "tontos" (representacionales) en la medida de lo posible, mientras que la lógica de obtención, mapeo y manejo de estado reside en los servicios RxJS.
2. **Uso Eficiente de RxJS**: Se aplican operadores como `takeUntil` para evitar fugas de memoria (`memory leaks`), `BehaviorSubject` para la gestión de estados globales y `catchError` para manejar fallos de red sin romper la experiencia del usuario.
3. **Escalabilidad Futura**: Al crecer la aplicación, el directorio `features/` permite agregar nuevos módulos independientes (ej. `features/contracts`, `features/analytics`, `features/crm`) cargados mediante _Lazy Loading_ (`loadChildren`) sin afectar el paquete inicial (_bundle_) de la aplicación.

### Arquitectura de Backend (Node.js + Express + TypeScript - Referencia de Diseño)

En la carpeta conceptual de backend, la API REST sigue un patrón **Controller-Service-Repository**:

- **Rutas (`/routes`)**: Exponen los 6 endpoints REST exigidos.
- **Controladores (`/controllers`)**: Manejan las peticiones HTTP y respuestas con códigos coherentes (200, 201, 400, 404, 500).
- **Servicios (`/services`)**: Contienen la lógica de negocio y construyen los **Aggregation Pipelines** de MongoDB.
- **Modelos (`/models`)**: Esquema Mongoose de Lead con esquemas tipados, validaciones estricta e índices de rendimiento.
- **Middlewares (`/middlewares`)**: Centralización de manejo de errores, validación de DTOs y CORS.

---

## 🎯 Decisiones Relevantes y Supuestos

1. **Autonomía y Resiliencia en Frontend**: Para garantizar que la prueba sea interactiva de inmediato sin requerir configuraciones complejas de MongoDB local en la máquina evaluadora, se implementó un motor de mock en el `LeadService` con los 10 registros del Anexo A que replica el comportamiento real de los 6 endpoints del backend.
2. **Validaciones en Formulario Reactivo**:
   - `name`: Obligatorio y mínimo 2 caracteres.
   - `email`: Obligatorio con expresión regular de correo estándar.
   - `budget`: Campo numérico obligatoriamente mayor que cero (`min(1)`).
   - `source`, `status`, `project`: Listas desplegables con valores restringidos.
3. **Paginación y Ordenamiento**: La tabla incluye paginación orientada a servidor y cambio dinámico de orden por `createdAt` o `budget` (ascendente / descendente).
4. **Diseño Visual**: Se priorizó una estética sobria, moderna y responsiva utilizando **Vanilla CSS**, tipografía **Inter** de Google Fonts, micro-animaciones y paletas cromáticas accesibles (badges de estado diferenciados por color).

---

## ⚠️ Limitaciones, Deuda Técnica y Mejoras Pendientes

1. **Autenticación y Autorización**: La versión actual no incluye JWT ni OAuth2 por estar fuera del alcance mínimo, pero en producción se recomienda incorporar `Guards` de Angular y middleware `bearer token` en el backend.
2. **WebSocket / Updates en Tiempo Real**: El dashboard se actualiza al realizar acciones en la app; para entornos con múltiples agentes de venta, se recomienda incorporar WebSockets (Socket.io) para recibir leads creados en tiempo real.
3. **Pruebas de Extremo a Extremo (E2E)**: Se incluyeron pruebas unitarias con Jasmine/Karma. Una mejora futura sería integrar Cypress o Playwright para pruebas E2E del flujo completo del usuario.

## 🤖 Declaración de Uso de IA

Se utilizaron asistentes de Inteligencia Artificial (Gemini) para acelerar la estructuración de la documentación técnica y generar las plantillas iniciales de las pruebas automatizadas.
