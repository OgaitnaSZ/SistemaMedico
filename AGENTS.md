# AGENTS.md

## Project Overview
This repo is a two-part medical system:
- `frontend/` is an Angular 20 SPA for login, dashboard, patients, consultations, file uploads, and settings.
- `backend/` is an Express + MongoDB API with JWT auth, validation, Swagger docs, and Jest/Supertest coverage.

The app is Spanish-first in UI text, route names, and comments.

## Architecture
The codebase follows a simple layered structure.
- Frontend: pages/components live under `frontend/src/app/pages`, reusable layout UI under `frontend/src/app/layout`, and shared API/state helpers under `frontend/src/app/core`.
- Backend: `routes -> validators/middleware -> controllers -> models/utils`.
- Shared business rules are centralized in controllers and helpers rather than spread across many abstractions.

There is no NgRx, repository layer, or backend service layer. Keep new work close to the existing pattern.

## Directory Structure
- `frontend/src/app/pages/` feature screens and feature-local components.
- `frontend/src/app/layout/` shell UI and shared dashboard primitives.
- `frontend/src/app/core/services/` HTTP services and localStorage auth helpers.
- `frontend/src/app/core/interfaces/` frontend data contracts.
- `backend/routes/` route wiring and Swagger annotations.
- `backend/controllers/` request handlers and domain logic.
- `backend/validators/` express-validator middleware.
- `backend/models/` Mongoose schemas.
- `backend/utils/` JWT, password, error, storage, and validation helpers.
- `backend/middleware/` auth middleware.
- `backend/test/` Jest/Supertest tests and fixtures.
- `backend/uploads/` runtime file storage, ignored by git.
- `backend/coverage/` generated coverage output, should not be hand-edited.

## Tech Stack
- Angular 20 standalone-style components with `bootstrapApplication`.
- Tailwind CSS 4 via `@import "tailwindcss"` and dark variant support.
- Angular Material snack bar and Material Symbols icons.
- `ng2-charts` + Chart.js for dashboard charts.
- `ngx-infinite-scroll` for patient list paging.
- Express 5, Mongoose 8, JWT, bcryptjs, multer, express-validator, swagger-jsdoc, swagger-ui-express.
- Jest + Supertest on the backend.

## Development Commands
Frontend commands from `frontend/package.json`:
- `npm start` -> `ng serve`
- `npm run build` -> `ng build`
- `npm run watch` -> `ng build --watch --configuration development`
- `npm test` -> `ng test`

Backend commands from `backend/package.json`:
- `npm start` -> `node index.js`
- `npm run dev` -> `nodemon .`
- `npm test` -> `cross-env NODE_ENV=test jest --coverage --silent --runInBand`
- `npm run test:watch` -> `cross-env NODE_ENV=test jest --coverage --watch --silent --runInBand`

There is no repo-defined lint or format script in either package.

## Coding Conventions
- TypeScript uses 2-space indentation and single quotes (`.editorconfig`).
- Backend uses CommonJS (`require`/`module.exports`), not ESM.
- Comments are often short, explanatory, and Spanish. Keep new comments sparse and useful.
- The code prefers direct imperative logic over extra abstractions.
- Keep data transformations close to the component/controller that uses them unless they are clearly reusable.

## Naming Conventions
- Angular classes use PascalCase with suffixes like `Component`, `Service`, `Guard`.
- Backend models use singular PascalCase filenames like `Paciente.js`, `Consulta.js`.
- Backend controller and utility functions use lowerCamelCase verbs like `crearPaciente`, `handleHttpError`, `verifyToken`.
- Routes use capitalized path segments in several endpoints, such as `/Crear`, `/Actualizar`, `/Paciente/:id`, `/Pacientes`.
- Frontend folders are lowercase and usually hyphenated.

## Component Guidelines
- Components are mostly feature-local and small, with logic kept in the class and markup in `templateUrl`.
- Components commonly declare `imports` directly in the decorator and compose other standalone components.
- Parent/child communication uses `@Input()` and `@Output()` rather than shared state.
- Template-driven forms with `FormsModule` and `[(ngModel)]` are the default.
- Use the existing event pattern when a child form needs to notify a parent, for example `FormConsultaComponent` emits `onFormularioEnviado`.

Representative examples:
- Feature shell: `frontend/src/app/pages/pacientes/paciente/paciente.component.ts`
- Child form: `frontend/src/app/pages/pacientes/paciente/historia-clinica/form-consulta/form-consulta.component.ts`
- Reusable dashboard primitive: `frontend/src/app/layout/shared/top-card/top-card.component.ts`
- Reusable list primitive: `frontend/src/app/layout/shared/listado-dashboard/listado-dashboard.component.ts`

## UI and Styling Guidelines
- Tailwind utility classes are the main styling mechanism.
- Dark mode is class-based on `<html>` using the `dark` class and a `theme` value in localStorage.
- The app uses Material Symbols for icons via the Google Fonts link in `frontend/src/index.html`.
- Reusable card styling is consistent: white/dark surface, rounded corners, shadow, and blue accent colors.
- The main shell is a desktop sidebar plus mobile bottom bar in `frontend/src/app/layout/navbar/navbar.component.html`.
- Use the existing shared dashboard pieces instead of creating new one-off dashboard cards or list widgets.

## State Management
- There is no global store.
- Auth state lives in `localStorage` through `LoginService`.
- Route protection uses `authGuard` plus `LoginService.isLoggedIn()`.
- Component-local state is the norm for forms, tables, toggles, and pagination.
- `PacientesComponent` manages search debounce, paging, and infinite-scroll flags locally.
- `DashboardComponent` derives totals locally from fetched stats.

## Data Fetching and APIs
- Frontend HTTP calls go through services in `frontend/src/app/core/services/`.
- Service URLs are hardcoded to `http://localhost:4000/api/...`.
- Auth headers are built from the token stored in localStorage.
- Most requests are simple `HttpClient.get/post/put/delete` calls with the bearer token.
- File uploads use `FormData` and `multipart/form-data`.
- Components subscribe directly to observables; there is no shared query layer.

Backend request flow:
- Routes wire middleware and controllers.
- Validators use `express-validator` plus `backend/utils/handleValidator.js`.
- Controllers call Mongoose models directly and return JSON.
- `backend/utils/handleError.js` is the shared error response helper.

## Forms and Validation
- Frontend forms are template-driven, not reactive.
- Required field checks are usually done in component methods before submit.
- Backend validation is centralized in `backend/validators/*.js`.
- For multi-item patient imports, `validatorPaciente` validates each array entry and returns indexed errors.

## Error Handling
- Backend errors usually go through `handleHttpError(res, message, code)`.
- Auth failures return 401 from `authMiddleware`.
- Validation failures return 403 in `handleValidator`.
- Frontend failures usually show a snackbar message and sometimes log to console.

## Testing
- Backend tests use Jest with Supertest in `backend/test/`.
- Test file names are ordered: `01_usuario.test.js`, `02_pacientes.test.js`, etc.
- Tests log in first, capture a JWT, then exercise protected endpoints.
- Fixtures live in `backend/test/helper/helperData.js`.
- `afterAll` closes the mongoose connection.
- There are no committed frontend `*.spec.ts` files in this repo.

## Adding New Features
- Start by finding the closest existing feature and copy its shape.
- Backend additions usually mean: model, validator, controller, route, Swagger doc, and test coverage.
- Frontend additions usually mean: page/component, service method, interface update if needed, and reuse of existing layout primitives.
- Keep route names and frontend service URLs aligned exactly, including capitalization.

## Reusing Existing Code
- Reuse `LoginService`, `SnackbarService`, `PacientesApiService`, `ConsultasApiService`, and `DashboardService` instead of creating duplicate HTTP helpers.
- Reuse `app-top-card`, `app-listado-dashboard`, `app-navbar`, and the patient detail subcomponents when building similar UI.
- Reuse `handleHttpError`, `handleValidator`, `authMiddleware`, and the `validator*` middleware in backend endpoints.

## Patterns to Follow
- Keep controllers thin enough to read top-to-bottom.
- Keep business rules in controllers/helpers, not in route files or templates.
- Use `@Input()`/`@Output()` for child component coordination.
- Keep derived state local to the component that needs it.
- Validate requests before controller logic.
- Keep backend delete flows aware of related data. Patient and consultation deletion already cascade through related records/files.

## Patterns to Avoid
- Do not introduce a second auth state mechanism alongside localStorage + `LoginService`.
- Do not bypass the existing service layer in Angular components.
- Do not move business logic into templates or route files.
- Do not add a second styling system alongside Tailwind utility classes.
- Do not hand-edit generated coverage output or runtime upload files.
- Do not assume backend file-field names from tests alone; verify controller/model shape first.

## Important Project-Specific Rules
- `backend/uploads/` is runtime storage and should be treated as generated content.
- `backend/coverage/` is generated and should not be edited manually.
- Frontend services currently target the deployed backend URL directly; update all service URLs together if this changes.
- JWT auth is bearer-token based and the backend middleware expects the header format `Authorization: Bearer <token>`.
- User settings and dark mode are persisted in localStorage.
- Route names and service paths are intentionally capitalized in several places; preserve the existing casing.

## Common Workflows
- Build a new patient-facing screen by composing the existing shell, `SnackbarService`, and API services.
- Build a new backend endpoint by copying the route/controller/validator pattern from `paciente.js` or `consulta.js`.
- Add a dashboard widget by following `DashboardComponent` plus the shared `TopCard` or `ListadoDashboard` patterns.
- Add a file-related feature by reviewing `handleStorage`, `archivoController`, and the existing file upload component.

## Representative Examples
- Auth flow: `frontend/src/app/pages/login/login.component.ts`, `backend/controllers/usuarioController.js`, `backend/middleware/session.js`.
- Patient list with debounce and infinite scroll: `frontend/src/app/pages/pacientes/pacientes.component.ts`.
- Patient detail with nested editing and file management: `frontend/src/app/pages/pacientes/paciente/historia-clinica/historia-clinica.component.ts`.
- Dashboard aggregation and chart rendering: `backend/controllers/dashboardController.js`, `frontend/src/app/pages/dashboard/grafico/grafico.component.ts`.
- File upload/delete flow: `frontend/src/app/pages/pacientes/paciente/historia-clinica/archivos-adjuntos/archivos-adjuntos.component.ts`, `backend/controllers/archivoController.js`.

## Known Legacy / Inconsistent Areas
- `backend/validators/archivo.js` validates `id` with `check("id")` instead of `param("id")`, unlike the other validators. Do not copy that pattern for new path params.
- `frontend/src/app/core/interfaces/archivo.model.ts` types `idConsulta` as `number`, but the backend treats it as a string/ObjectId value.
- File-related responses are not perfectly uniform across controllers and tests. Verify actual controller payloads before depending on field names.
- Several files contain console logging and Spanish dev comments that look like working-code leftovers, not a formal logging strategy.
- Some controllers still contain circularly-related helper logic inline. Prefer the current pattern unless there is a clear reason to extract it.

## Files to Treat as Source of Truth
- Frontend routing: `frontend/src/app/app.routes.ts`
- Frontend auth/shell behavior: `frontend/src/app/auth.guard.ts`, `frontend/src/app/app.component.ts`
- Backend entry point: `backend/index.js`
- Backend auth middleware: `backend/middleware/session.js`
- Backend validation helpers: `backend/validators/*.js`
- Backend tests and fixtures: `backend/test/*.js`, `backend/test/helper/helperData.js`
