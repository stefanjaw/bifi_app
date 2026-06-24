import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HasPermission } from '@avalantec/base-app/auth';
import { MENU_ITEMS } from '@avalantec/base-app/core';
import { SearchService } from '@avalantec/base-app/search';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudSearchDestinations } from '../../services/crud-search-destinations';
import { searchDestinationColumns } from '../../libraries/search-destination-columns';
import { searchDestination } from '../../interfaces/search-destination';

@Component({
  selector: 'bifi-app-search-destinations-list',
  providers: [provideResourceManager(CrudSearchDestinations)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, TooltipModule, SearchBar, HasPermission, RouterLink],
  templateUrl: './search-destinations-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDestinationsList {
  private resourceManager = inject<ResourceManager<searchDestination>>(ResourceManager);
  private crud = inject(CrudSearchDestinations);
  private menuItems = inject(MENU_ITEMS);
  private searchService = inject(SearchService);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchDestinationColumns = searchDestinationColumns;
  destinations = this.resourceManager.data;
  toggleInactiveRecords = this.resourceManager.toggleInactiveRecords;
  showInactiveStatus = this.resourceManager.getInactiveStatus;
  syncing = signal(false);

  goToEdit = (element: searchDestination) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  /** Soft-delete (custom rows only). */
  deleteDestination(id: string) {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.afterMutation();
        },
      });
  }

  /** Deactivate without deleting (used for protected system rows). */
  setActive(id: string, active: boolean) {
    this.crud
      .put({ _id: id, data: { active } })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.afterMutation();
        },
      });
  }

  /**
   * Discover newly added app destinations from the live menu tree and merge
   * them into the collection — WITHOUT overwriting existing custom phrases or
   * reactivating rows the user deactivated.
   *
   * Strategy: pass every currently-active system row through untouched (so the
   * backend never deactivates them), and only add menu entries whose route is
   * not already present. New rows ship with empty keywords for the user to fill.
   */
  syncFromMenu() {
    this.syncing.set(true);
    this.crud
      .getAllDestinations()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: existing => {
          const rows = Array.isArray(existing) ? existing : [];
          const existingRoutes = new Set(rows.map(d => this.normalizeRoute(d.route)));

          const activeSystem = rows
            .filter(d => d.isSystem && d.active)
            .map(d => ({
              key: d.key,
              label: d.label,
              route: d.route,
              icon: d.icon ?? '',
              group: d.group ?? '',
              keywords: d.keywords ?? [],
              description: d.description ?? '',
              resource: d.resource ?? '',
            }));

          const seenNewKeys = new Set<string>();
          const newOnes: Record<string, any>[] = [];
          for (const item of this.flattenMenu(this.menuItems())) {
            const normalized = this.normalizeRoute(item.route);
            if (existingRoutes.has(normalized)) continue;
            const key = this.routeToKey(item.route);
            if (!key || seenNewKeys.has(key)) continue;
            seenNewKeys.add(key);
            newOnes.push({
              key,
              label: item.label,
              route: item.route,
              icon: item.icon ?? '',
              group: item.group ?? '',
              keywords: [],
              resource: item.resource ?? '',
            });
          }

          this.crud
            .sync([...activeSystem, ...newOnes])
            .pipe(takeUntilDestroyed(this.destroy$))
            .subscribe({
              next: () => {
                this.syncing.set(false);
                this.afterMutation();
              },
              error: () => this.syncing.set(false),
            });
        },
        error: () => this.syncing.set(false),
      });
  }

  private afterMutation() {
    this.searchService.load(true);
    this.destinations.reload();
  }

  /** Recursively flatten menu items into navigable destinations. */
  private flattenMenu(
    items: MenuItem[],
    group = ''
  ): Array<{ label: string; route: string; icon?: string; group?: string; resource?: string }> {
    const out: Array<{
      label: string;
      route: string;
      icon?: string;
      group?: string;
      resource?: string;
    }> = [];

    for (const item of items ?? []) {
      const route = this.routerLinkToRoute(item.routerLink);
      const itemGroup = group || (item.label ?? '');

      if (route) {
        out.push({
          label: item.label ?? route,
          route,
          icon: item.icon,
          group: group || itemGroup,
          resource: (item as Record<string, any>)['resource'],
        });
      }

      if (Array.isArray(item.items) && item.items.length) {
        out.push(...this.flattenMenu(item.items, itemGroup));
      }
    }

    return out;
  }

  private routerLinkToRoute(routerLink: unknown): string {
    if (!routerLink) return '';
    if (Array.isArray(routerLink)) {
      return routerLink.join('/').replace(/\/{2,}/g, '/');
    }
    return String(routerLink);
  }

  private normalizeRoute(route: string): string {
    return (route ?? '')
      .trim()
      .toLowerCase()
      .replace(/^\/+/, '/')
      .replace(/^([^/])/, '/$1')
      .replace(/\/+$/, '');
  }

  private routeToKey(route: string): string {
    return (route ?? '')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '')
      .replace(/\//g, '.');
  }
}
