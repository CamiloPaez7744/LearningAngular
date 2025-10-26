<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this repo -->
# TesloShop — Copilot instructions

> **Note**: For general development best practices, coding standards, and design patterns, see [AGENTS.md](AGENTS.md)

This file contains concise, actionable guidance for AI coding agents to be productive in the `09-teslo-shop` Angular project inside this workspace.

Keep guidance short and specific — prefer code references and exact commands.

1) Big picture
- This repository contains multiple demo Angular apps; the relevant app is `09-teslo-shop/` (Angular v20). The app is a small e‑commerce front-end split in two main route trees:
  - Auth area (lazy) — `src/app/auth/**` (routes defined in `src/app/auth/auth.routes.ts`).
  - Store-front (lazy) — `src/app/store-front/**` (routes defined in `src/app/store-front/store-front.routes.ts`).

- Root routes are defined in `src/app/app.routes.ts` which lazy-loads the two subtrees.

2) Architecture & patterns
- Routing: Uses Angular standalone components and lazy-loaded route modules. See `auth.routes.ts` for examples of `loadComponent` and `AuthLayoutComponent` usage.

- Http services: Services use `inject(HttpClient)` and environment base URL from `src/environments/environment*.ts`. Example: `src/app/products/services/products.service.ts`.
  - Services cache responses in-memory using Maps (see `products.service.ts`). Follow that pattern when adding simple client-side caches.

- Components: Most pages are standalone components loaded via `loadComponent`. Use `imports: [...]` within the `@Component` decorator to add Angular primitives (e.g., `RouterLink`). See `src/app/auth/pages/register-page/register-page.component.ts`.

- Styling: Tailwind + DaisyUI are used (check `package.json` devDependencies). Global styles in `src/styles.css` and public assets in `public/`.

3) Key files to reference
- Build & scripts: `09-teslo-shop/package.json` — scripts: `npm start`/`ng serve`, `npm run build`, `npm test`.
- Angular CLI config: `09-teslo-shop/angular.json` — build/serve/test configurations and file replacements for development.
- Environment: `src/environments/environment.ts` and `environment.development.ts` — backend BASE_URL is `environment.baseUrl`.
- Example services and patterns: `src/app/products/services/products.service.ts`, `src/app/products/interfaces/*.ts`.

4) Developer workflows (commands)
- Install deps (from the app folder):
  ```powershell
  npm install
  ```
- Start dev server (defaults to port 4200):
  ```powershell
  npm start
  # or explicitly
  ng serve --configuration development
  ```
- Build production:
  ```powershell
  npm run build
  ng build --configuration production
  ```
- Tests (Karma):
  ```powershell
  npm test
  ```

Notes: The project uses Angular CLI v20 builder entries in `angular.json` (builders `@angular/build:*`). Use the CLI that matches the `devDependencies` version in `package.json`.

5) Conventions & small rules
- Prefer lazy-loading and standalone components for pages (the codebase uses `loadComponent` and `imports` inside `@Component`). Mirror that when adding new pages.
- Environment values: read `environment.baseUrl` instead of hardcoding endpoints.
- Services: use `inject(HttpClient)` (not constructor injection) when adding services that follow current code style.
- Caching: When adding caching, use Maps as in `products.service.ts` and return cached values wrapped with `of(...)` from `rxjs`.

**Code commenting conventions:**
- **Do NOT add inline comments in code**. Explain changes, decisions, and implementation details in the chat response instead.
- Only add comments if absolutely necessary — prefer self-documenting code with clear names.
- If a comment is truly needed, place it as a header comment (JSDoc style) explaining **WHY** something is done, not **WHAT** it does.
- Example of acceptable comment:
  ```typescript
  /**
   * Uses a debounce to prevent excessive API calls when user types quickly.
   * Backend rate limit is 10 req/sec per user.
   */
  searchProducts(query: string): Observable<Product[]> { ... }
  ```
- Never add comments like `// Get all products` or `// Loop through items` — the code should be clear enough.

6) Integration points & external dependencies
- Backend API: expected at `http://localhost:4000/api` (see `src/environments/*.ts`). Changes to the API require updating environment files and service interfaces in `src/app/products/interfaces/`.
- UI libs: TailwindCSS, DaisyUI, Swiper are used — ensure PostCSS + Tailwind config matches their versions (check root `package.json` of the demo app).

7) Code examples AI agents can follow
- Adding a lazy route (auth example): see `src/app/auth/auth.routes.ts` — use `loadComponent` and `AuthLayoutComponent` as parent with `children`.
- HTTP GET with caching (products): see `getAllProducts` in `src/app/products/services/products.service.ts`.

8) What not to change automatically
- Do not update `angular.json` builders unless a clear breaking reason exists. Any CLI upgrade is developer-reviewed.
- Do not change `environment*.ts` values without adding a matching replacement config in `angular.json` (the project expects `development` replacements already configured).

9) Quick PR checklist for automated edits
- Preserve lazy-loading and standalone components.
- Update imports to use the `@...` path aliases (the code uses `@env` and `@products`), or keep relative imports if unsure.
- Run `npm install` and `npm test` locally to validate changes.

If anything in this guidance is unclear or you'd like more detail about a specific area (tests, CI setup, or other app folders), tell me which part to expand. 
