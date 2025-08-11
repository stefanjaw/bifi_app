# BaseApp Architecture & Usage Guide

This document defines the official architectural guidelines, coding standards, and usage patterns for all projects using `@avalantec/base-app`. Adherence to these rules is **mandatory** to ensure maintainability, reusability, and consistency.

---

## 1. Importing

Importing will depend on the library you are going to need

```ts
import { SomeComponent, someService } from '@avalantec/base-app/library';
```

Do **not** import from internal paths.

---

## 2. Project Structure

Each feature module should follow this folder structure:

```
my-feature/
├── features/      # Smart components (logic + services)
├── ui/            # Dumb (presentational) components
├── services/      # Module-specific services
├── routes/        # Route files
├── directives/    # Custom directives
├── interfaces/    # Local TypeScript interfaces
└── libraries/     # Misc utilities
└──── providers/   # Injection providers (when necessary)
└──── pipes/       # Pipes
└──── utils.ts     # Utility functions
```

Example route (exporting public routes example)

```ts
import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../features/products-list/products-list.component').then(
        m => m.ProductsListComponent
      ),
  },
];
```

Use PrimeNG Angular component library (mandatory)

---

## 3. Smart vs Dumb Components

### Smart Components (`features/`)

- May **inject services** using Angular's `inject()` function.
- Contain business logic, data fetching, and state management.
- May communicate with backend or other modules.

### Dumb Components (`ui/`)

- Purely presentational.
- Communicate **only** via `input()` and `output()` (Angular Signals APIs).
- **Must NOT inject** custom services (generic services like translation or form helpers are allowed).
- Do **not** contain business logic.

---

## 4. Component File Conventions

Each component lives in its own folder with these files:

```
user-form/
├── user-form.ts         # Component logic (Standalone Component)
├── user-form.html       # Template HTML
├── user-form.model.ts   # (Optional) local interfaces/types only for the component
```

- The `.model.ts` file is for interfaces/types **used exclusively inside the component** to avoid polluting global scope. This file is optional and only if an interface that only exists for this component (like an input type) is needed.

---

## 5. Naming Conventions

- Use **no suffixes** like `.component.ts`, `.service.ts`, `.directive.ts`.
- Files end simply with `.ts`.
- Component class names omit the "Component" suffix.

Example:

```ts
// File: user-form.ts
export class UserForm {}
```

- Types and interfaces use **camelCase** starting with lowercase:

```ts
interface userFormValues {
  firstName: string;
  lastName: string;
}
```

---

## 6. Dependency Injection

Use Angular's new `inject()` function **inside** services and components instead of constructor injection.

Example:

```ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  fetchUsers() {
    return this.http.get('/api/users');
  }
}
```

---

## 7. Reactivity: Angular Signals Only

We **strongly prefer** Angular Signals instead of RxJS Observables.

Use only these APIs for reactivity:

- `signal()`
- `computed()`
- `effect()`
- `input()`
- `output()`
- `viewChild()`
- `viewChildren()`
- `viewContent()`
- `model()`

Example:

```ts
import { signal, computed, effect, input, output } from '@angular/core';

const count = signal(0);
const doubled = computed(() => count() * 2);

effect(() => console.log('Doubled count:', doubled()));

const userName = input<string>();
const onSave = output<void>();
```

Avoid RxJS observables and operators such as `BehaviorSubject`, `subscribe()`, `switchMap()`, etc.
Only use RxJS if necessary with DestroyRef and takeUntilDestroyed

---

## 8. Summary of Rules for Any App Using BaseApp

- Import everything from `@avalantec/base-app` main barrel or library specific entry point such as `@avalantec/base-app/form`.
- Use Angular Standalone Components without NgModules.
- Separate Smart (`features/`) and Dumb (`ui/`) components.
- Smart components **can inject** services using `inject()`.
- Dumb components only use `input()` and `output()`.
- Use Angular Signals API exclusively for reactive state.
- Follow strict file and type naming conventions.
- Organize modules with dedicated folders for services, directives, interfaces, and libraries.
- Keep code modular, reusable, and maintainable.

---

## 9. License

© Avalantec

---

```

```
