# Gantt Module — Test Results

All tests are manual unless noted otherwise. Pass/Fail column filled in during the test run.

> **Module scope:** Gantt chart view (recovered feature set) — the shared `bifi-app-gantt-view` in `@avalantec/base-app/resource`, consumed by the **Tasks** module (`tasks-main-view`, external switcher in toolbar) and the **Projects** module (`projects-list`, embedded switcher).
>
> **Recovered features under test:**
> 1. External (parent-controlled) mode switcher in the Tasks toolbar, with `gantt-view` receiving `viewMode` via two-way binding and its internal switcher hidden (`showSwitcher=false`).
> 2. Time-precise "now" indicator — the red vertical line tracks the actual time-of-day (`fracOfDay`/`fracOfMonth`), not a static cell midpoint.
> 3. Per-cell "today" highlighting — today header text in red (`text-red-500`) and today column tinted `bg-red-50`.
> 4. `projects-list` unchanged — embedded switcher retained (default `showSwitcher=true`) while still inheriting the today-marker from `gantt-view`.
>
> **Pre-requisites:** logged-in user (opencode@test.com), tasks & projects data present, app running on `:4200`.

---

## 1. Tasks Gantt — Switcher Placement

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Open Tasks and land on the Gantt view | Mode switcher (Día/Semana/Mes/Año/Vista General) is rendered in the **toolbar**, right-aligned (`ml-auto`), NOT inside the gantt sidebar header | ✅ |
| 1.2 | Inspect the DOM for gantt switcher instances | Exactly ONE `bifi-app-gantt-switcher` present, located outside `bifi-app-gantt-view` (embedded one hidden by `showSwitcher=false`) | ✅ |

## 2. Tasks Gantt — Mode Switching

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Click each toolbar mode: Día, Semana, Mes, Año, Vista General | Each click switches the gantt time scale/layout (Day→hour ticks; Week→day-of-week; Month→day numbers; Year→12 month labels; Overview→dependency layout) and highlights the active button | ✅ |

## 3. Tasks Gantt — Today Indicator (marker)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Observe the red vertical "now" line in Day/Week/Month views | The line is positioned at the **actual time-of-day** within the today cell (e.g. near the day's end at ~22:00), not the static cell midpoint | ✅ |
| 3.2 | Observe the today column | Today header text is red (`text-red-500`) and today column body carries a `bg-red-50` tint | ✅ |
| 3.3 | Observe the TODAY/NOW pill | A red pill badge (HOY/AHORA, i18n) appears above the red line | ✅ |

## 4. Tasks Gantt — Switcher Visibility by View State

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Switch from Gantt to List view | The toolbar gantt switcher disappears (it is gated by `viewState() === 'gantt'`); gantt view is removed | ✅ |

## 5. Projects Gantt — Embedded Switcher (unchanged)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Open Projects and land on the Gantt view | The mode switcher is embedded **inside** the `gantt-view` sidebar header (default `showSwitcher=true`); no external toolbar switcher | ✅ |
| 5.2 | Observe the Projects gantt today indicator | Red now-line, today column red header + `bg-red-50` tint, and HOY badge are all visible (inherited from `gantt-view`) | ✅ |

## 6. Console & Regression

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Perform the above steps while watching the console | No console errors or warnings (`@angular/dev` console) | ✅ |
| 6.2 | Confirm `projects-list` unaffected by the Tasks switcher change | Projects gantt renders its switcher without any `showSwitcher` binding (default) and no exceptions | ✅ |

---

## Summary

| Section | Result |
|---------|--------|
| 1. Tasks Switcher Placement | ✅ PASS (8/8 checks across sections) |
| 2. Mode Switching | ✅ PASS |
| 3. Today Indicator | ✅ PASS |
| 4. Switcher Visibility | ✅ PASS |
| 5. Projects Embedded Switcher | ✅ PASS |
| 6. Console & Regression | ✅ PASS (0 errors / 0 warnings) |

**Overall: 10/10 PASS, 0 FAIL, 0 BLOCKED.**

### Evidence captured (DOM inspection via browser)
- **Tasks gantt:** exactly 1 switcher, `ml-auto` wrapper present, `insideGantt=false`; Day mode showed hour ticks `0,3,6,9,12,15,18,21,0` and red now-line at x=703 (~22:00, non-midpoint); red pill `AHORA`; Month mode day cells `1–12`; Year mode month labels `Ene–Dic`; Week mode today header `Mié, 26 Ago` red, `bg-red-50` count 4, badge `HOY`, red line x=548.
- **List view:** `ganttSwitchers=0`, `tasksListView=1`.
- **Projects gantt:** 1 switcher, `insideGanttView=true`, `insideTasksHeader=false`; today-marker present (`HOY`, red line x=548, red today header, `bg-red-50` count 4).
- **Console:** 18 messages total, **0 errors / 0 warnings**.
