// core.md content
const coreMd = `

# BaseApp Core Module – Documentation

This document describes the **Core** module exported at `@avalantec/base-app/core`.  
Core provides directives, shared components, utilities and services that define the visual language and cross-cutting behavior of applications built with BaseApp. Follow these rules to keep consistency and maintainability across teams and to enable AI-assisted code generation.

---

## 1. Importing

Import Core public APIs **only** from the main public entry point:

```ts
import { TextDirective, IconDirective } from '@avalantec/base-app/core';
```

**Do not** import from internal or deep paths (avoid `@avalantec/base-app/core/...`).

---

## 2. Core folder structure (recommended)

```
baseapp/
  core/
    directives/
      text.directive.ts
      icon.directive.ts
    components/
      base-layout.ts
      form-field.ts
    services/
      core-config.service.ts
    decorators/
      public.decorator.ts
    utils/
      accessibility.ts
      style-mapping.ts
    index.ts                # public exports
```

- Keep each directive/component/service in its own file.
- Public exports must live in `core/index.ts` and be re-exported from `@avalantec/base-app/core`.

---

## 3. Directives

### 3.1 `bifiAppText` (Text directive)

**Purpose**  
Standardize typography by applying a small set of well-defined text sizes and weights.

**Selector / usage**

```html
<p bifiAppText="small">...</p>
```

**Input alias**: `bifiAppText`  
**Type**:

```ts
type TextSize = 'title-1' | 'title-2' | 'title-3' | 'paragraph' | 'small';
```

**Generated inline styles** (canonical mapping):

- `title-1` → `font-size: 2rem; font-weight: 600;`
- `title-2` → `font-size: 1.5rem; font-weight: 600;`
- `title-3` → `font-size: 1.25rem; font-weight: 600;`
- `paragraph` → `font-size: 1rem; font-weight: 400;`
- `small` → `font-size: 0.75rem; font-weight: 400;`

**Example usage**

```html
<p bifiAppText="paragraph"> Welcome to the inspection dashboard </p>

<h1 bifiAppText="title-1">Product details</h1>
```

**Implementation notes**

- Directive should use Angular Signals (`input()`, `computed()`) for reactive input handling.
- Prefer setting `host: { '[style]': 'textStyle()' }` so the style is applied inline and predictable.
- Avoid coupling directive to CSS frameworks; the directive owns size → style mapping.

**Best practices**

- Use only the allowed `TextSize` values to preserve visual consistency.
- Do not mix multiple typography directives on the same element.
- Do not use `bifiAppText` to change color or spacing — use separate utility classes or theme tokens for that.

**Accessibility**

- Ensure headings used with `title-*` remain semantic (`h1`, `h2`, `h3`) where appropriate — the directive changes visual size only, not semantics.
- When using small fonts, ensure contrast meets WCAG AA for body text.

**Testing**

- Unit tests should assert that each `TextSize` produces expected style string.
- Include tests for default value (when attribute omitted).

---

### 3.2 `bifiAppIcon` (Icon directive)

**Purpose**  
Provide a consistent sizing scale for icons used across the UI.

**Selector / usage**

```html
<i class="pi pi-user" bifiAppIcon="md"></i>
```

**Input alias**: `bifiAppIcon`  
**Type**:

```ts
type IconSize = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl';
```

**Generated inline styles** (canonical mapping):

- `xs` → `font-size: 0.25rem;`
- `sm` → `font-size: 0.5rem;`
- `md` → `font-size: 0.8rem;`
- `base` → `font-size: 1rem;`
- `lg` → `font-size: 1.5rem;`
- `xl` → `font-size: 2rem;`

**Example usage (with tooltip)**

```html
<label [for]="controlId()">Help</label>

<i
  class="pi pi-question-circle"
  bifiAppIcon="base"
  [pTooltip]="tooltipText"
  tooltipPosition="right"
></i>
```

**Implementation notes**

- Use `computed()` to map input value to style value and `host` binding for inline style.
- Directive should be lightweight and not perform DOM mutations beyond style binding.

**Best practices**

- Prefer `bifiAppIcon` over ad-hoc CSS icon-sizing classes.
- Use semantic HTML elements where possible (e.g., `button` for clickable icons).
- Keep icon sizing independent from container layout; the directive should only control `font-size`.

**Accessibility**

- For decorative icons, add `aria-hidden="true"`.
- For meaningful icons (controls, actions), provide accessible name via `aria-label` or visually-hidden text.

**Testing**

- Unit tests should confirm mapping values and that default `base` is applied when omitted.

---

## 4. Components & Services (Core-level guidance)

### 4.1 Core components

- Core may expose shared presentational components (base layout, toolbar, form-field wrappers).
- Core components should be **dumb/presentational** by default — accept inputs and emit outputs; avoid injecting feature-level services.
- If a Core component needs global configuration (theme, date formats), inject a `CoreConfigService`.

### 4.2 Core services

- Services that belong to Core must have a single responsibility (e.g., `core-config.service`, `core-logger.service`).
- Prefer `providedIn: 'root'` and `inject()` inside service implementation.
- Avoid direct HTTP calls from Core services — instead provide general utilities. If HTTP is necessary, design the service to be easily mocked.

---

## 5. Decorators & Utilities

### 5.1 Decorators

- Keep Core decorators minimal and generic (e.g., `@Public()` or `@RequireRole()` for route metadata).
- Decorators should only attach metadata; runtime behavior should live in guards/interceptors.

### 5.2 Utilities

- Centralize style or mapping helpers in `utils/style-mapping.ts`.
- Avoid global side-effects; utilities should be pure functions where possible.

---

## 6. Accessibility (A11y)

- Typography sizes must maintain contrast ratios and legibility.
- Icons used as controls must have keyboard focus behavior and clear accessible names.
- When a directive changes only visual appearance, ensure semantics remain accessible (e.g., using appropriate heading tags).

---

## 7. Patterns, SOLID & Maintainability

- **Single Responsibility**: each directive does one thing (text sizing, icon sizing).
- **Open/Closed**: prefer mapping tables or configuration to extend sizes instead of editing directive logic.
- **Liskov Substitution**: directives should be drop-in safe for any element; do not assume element type.
- **Interface Segregation**: expose only the small inputs needed (`bifiAppText`, `bifiAppIcon`).
- **Dependency Inversion**: Core should depend on abstractions (config interfaces) rather than concrete feature code.

---

## 8. Rules for Developers & AI Code Generators

- **Import rule**: only import from `@avalantec/base-app/core`.
- **Allowed inputs**: respect `TextSize` and `IconSize` sets — do not invent new values without following change process.
- **Styling rule**: do not override Core styles globally for elements that use these directives. If a change is needed, update Core mappings and release.
- **Semantics rule**: keep markup semantic — use heading tags for headings even if `bifiAppText` is applied.
- **Testing rule**: generated code should include minimal unit tests that validate directive usage when practical.
- **AI-specific**:
  - When generating views, the AI must prefer directives over inline style rules for typography and icon sizing.
  - If the AI needs a size not in the canonical list, it must add a TODO comment and open a PR to Core (or request allowed extension).
  - The AI should emit examples and a short usage note in generated components for maintainers.

---

## 9. Example: standalone component using Core directives

```ts
// product-inspection.ts (Standalone component)
import { Component, computed, signal } from '@angular/core';
import { TextDirective, IconDirective } from '@avalantec/base-app/core';

@Component({
  selector: 'app-product-inspection',
  standalone: true,
  imports: [TextDirective, IconDirective],
  template: `
    <section>
      <h2 bifiAppText="title-2">{{ productTitle }}</h2>

      <p bifiAppText="paragraph">
        Perform inspection for: {{ productModel }} - {{ serialNumber }}
      </p>

      <div class="controls">
        <button aria-label="Help">
          <i class="pi pi-question-circle" bifiAppIcon="md" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  `,
})
export class ProductInspection {
  productModel = signal('X-200');
  serialNumber = signal('A1234');

  get productTitle() {
    return `${this.productModel()} · ${this.serialNumber()}`;
  }
}
```

---

## 10. Edge cases & troubleshooting

- If styles do not apply, confirm the directive is exported and included in the component's `imports` (for standalone) or module declarations (if using modules).
- If multiple style sources conflict, prefer Core directive as the source of truth. Avoid `!important` in stylesheets.
- When integrating third-party icon libraries, `bifiAppIcon` should still be used to control `font-size`. If third-party components override font-size, wrap them or apply a small adapter component.

---

## 11. Future work / Changelog

- Version new size tokens behind configuration to allow theming without code changes.
- Consider moving style mappings to a theme provider that Core services expose (for runtime customization).
- Add automated visual regression tests to ensure size mappings remain stable.

---

## 12. License

© Avalantec

---

`;

export default coreMd;
