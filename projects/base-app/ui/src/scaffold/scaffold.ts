import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { EventType, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {
  DebugManager,
  DynamicBreadcrumbService,
  SidenavManager,
  ToolbarManager,
} from '@avalantec/base-app/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { UserPanel } from '../user-panel/user-panel';
import { GlobalSearch } from '../global-search/global-search';
import { NotificationPanel } from '../notifications/notification-panel';
import { DirtyFormConfirmationDialog } from '@avalantec/base-app/form';
import { HasPermission, injectAuthService } from '@avalantec/base-app/auth';
import { RippleModule } from 'primeng/ripple';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { MainMenuManager, ShortcutItem, UserShortcutsService } from '@avalantec/base-app/routing';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MenuItem, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { filter, take } from 'rxjs';

@Component({
  selector: 'bifi-app-scaffold',
  imports: [
    ToolbarModule,
    RouterOutlet,
    Toast,
    MenubarModule,
    ButtonModule,
    CommonModule,
    NgxSonnerToaster,
    UserPanel,
    ScrollPanelModule,
    RippleModule,
    HasPermission,
    RouterLink,
    TooltipModule,
    TranslatePipe,
    GlobalSearch,
    NotificationPanel,
    DirtyFormConfirmationDialog,
  ],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
  brandIcon = input('');

  private router = inject(Router);
  private destroy$ = inject(DestroyRef);
  debugManager = inject(DebugManager);

  // auth state
  private authService = injectAuthService();
  user = this.authService.user;

  // sidenav management
  protected sidenavManager = inject(SidenavManager);
  isOpened = model(this.sidenavManager.opened());

  // menu management
  private dynamicBreadcrumb = inject(DynamicBreadcrumbService);
  private menuManager = inject(MainMenuManager);
  menuItems = this.menuManager.menuItems;

  // toolbar management
  private toolbarManager = inject(ToolbarManager);
  toolbarItems = this.toolbarManager.toolbarItems;

  // check if logged
  isLogged = computed(() => !!this.user());

  // shortcuts
  userShortcutsService = inject(UserShortcutsService);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);

  // current route
  currentRoute = signal(this.router.url);

  // Active top-level menu item (the sidebar item whose subtree contains the current route)
  activeParentItem = computed<MenuItem | null>(() => {
    const route = this.currentRoute();
    if (!route || route === '/' || route.startsWith('/home')) return null;
    const items = this.menuItems();
    return items.find(item => this.isItemActive(item) || this.hasActiveChild(item)) ?? null;
  });

  // Set of all descendant routerLinks of the active parent item; null = show all (home)
  private activeDescendantLinks = computed<Set<string> | null>(() => {
    const parent = this.activeParentItem();
    if (!parent) return null;
    const links = new Set<string>();
    const toLink = (rl: string | string[] | undefined): string | null => {
      if (!rl) return null;
      return (Array.isArray(rl) ? (rl as string[]) : [rl as string]).join('/').replace(/^\//, '');
    };
    const walk = (list: MenuItem[]) => {
      for (const item of list) {
        const l = toLink(item.routerLink as string | string[]);
        if (l) links.add(l);
        if (item.items) walk(item.items as MenuItem[]);
      }
    };
    const parentLink = toLink(parent.routerLink as string | string[]);
    if (parentLink) links.add(parentLink);
    if (parent.items) walk(parent.items as MenuItem[]);
    return links;
  });

  filteredShortcuts = computed(() => {
    const all = this.userShortcutsService.shortcuts();
    const links = this.activeDescendantLinks();
    if (!links) return all;
    return all.filter(s => {
      const link = (s.routerLink ?? []).join('/').replace(/^\//, '');
      return links.has(link);
    });
  });

  // drag state
  isDragOver = signal(false);
  isDragRejected = signal(false);
  dragOverIndex = signal<number | null>(null);
  private dragSourceIndex: number | null = null;
  private draggedItemModule = signal<string | null>(null);

  currentModuleLabel = computed(() => {
    const item = this.activeParentItem();
    return item
      ? this.translationService.translate(item.label ?? '', {}, item['scope'] as string)
      : '';
  });

  // ─── Breadcrumbs ───────────────────────────────────────────────────────────

  private flatMenu = computed(() => this.flattenMenu(this.menuItems()));

  private readonly SKIP_SEGMENTS = new Set(['edit', 'new', 'create']);

  breadcrumbs = computed<{ label: string; link: string; isLast: boolean }[]>(() => {
    const url = this.currentRoute().split('?')[0].split('#')[0];
    const segments = url.split('/').filter(Boolean);
    if (segments.length === 0 || segments[0] === 'home') return [];
    const menu = this.flatMenu();
    const crumbs: { label: string; link: string; isLast: boolean }[] = [];
    let cumulative = '';
    const visibleSegments = segments.filter(s => !this.SKIP_SEGMENTS.has(s));
    segments.forEach(seg => {
      cumulative += '/' + seg;
      if (this.SKIP_SEGMENTS.has(seg)) return;
      const menuMatch = menu.find(m => m.path === cumulative.replace(/^\//, ''));
      const dynLabel = this.isId(seg) ? this.dynamicBreadcrumb.labels()[seg] : undefined;
      const label = menuMatch
        ? this.translationService.translate(menuMatch.label, {}, menuMatch.scope)
        : (dynLabel ?? (this.isId(seg) ? 'Details' : this.humanize(seg)));
      crumbs.push({
        label,
        link: cumulative,
        isLast: seg === visibleSegments[visibleSegments.length - 1],
      });
    });
    return crumbs;
  });

  private flattenMenu(items: MenuItem[]): { path: string; label: string; scope: string }[] {
    const out: { path: string; label: string; scope: string }[] = [];
    const walk = (list: MenuItem[]) => {
      for (const it of list) {
        const link = Array.isArray(it.routerLink)
          ? (it.routerLink as string[]).join('/')
          : (it.routerLink as string);
        if (link && it.label)
          out.push({
            path: link.replace(/^\//, ''),
            label: it.label,
            scope: it['scope'] as string,
          });
        if (it.items) walk(it.items as MenuItem[]);
      }
    };
    walk(items);
    return out;
  }

  private humanize(seg: string): string {
    return seg
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private isId(seg: string): boolean {
    return /^[0-9a-f]{24}$/i.test(seg) || /^\d+$/.test(seg);
  }

  constructor() {
    effect(() => {
      const isSidenavOpen = this.sidenavManager.opened();
      this.isOpened.set(isSidenavOpen);
    });

    effect(() => {
      const isLocallyOpen = this.isOpened();
      this.sidenavManager.setOpenSidenav(isLocallyOpen);
    });

    this.router.events.pipe(takeUntilDestroyed(this.destroy$)).subscribe(event => {
      if (event.type === EventType.NavigationEnd) this.currentRoute.set(this.router.url);
    });

    // Auto-expand sidebar items whose children match the active route
    effect(() => {
      const items = this.menuItems();
      const keysToAdd = new Set<string>();
      const walk = (list: MenuItem[]) => {
        for (const item of list) {
          if (item.items && this.hasActiveChild(item)) {
            keysToAdd.add(this.menuKey(item));
          }
          if (item.items) walk(item.items as MenuItem[]);
        }
      };
      walk(items);
      if (keysToAdd.size > 0) {
        this.expandedMenuKeys.update(current => {
          const next = new Set(current);
          keysToAdd.forEach(k => next.add(k));
          return next;
        });
      }
    });

    // Load shortcuts once when the user is first available
    toObservable(this.user)
      .pipe(
        filter(u => !!u),
        take(1),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe(() => this.userShortcutsService.loadShortcuts());
  }

  isItemActive(item: MenuItem): boolean {
    const itemURL = Array.isArray(item.routerLink)
      ? (item.routerLink as string[] | undefined)?.join('/')
      : (item.routerLink as string);

    if (!itemURL) return false;

    return this.currentRoute().startsWith(itemURL);
  }

  isShortcutActive(shortcut: ShortcutItem): boolean {
    if (!shortcut.routerLink) return false;
    return this.currentRoute().startsWith(shortcut.routerLink.join('/'));
  }

  hasActiveChild(item: MenuItem): boolean {
    if (!item.items) return false;
    return item.items.some(child => this.isItemActive(child) || this.hasActiveChild(child));
  }

  // ─── Sidebar accordion ─────────────────────────────────────────────────────

  expandedMenuKeys = signal<Set<string>>(new Set());

  private menuKey(item: MenuItem): string {
    const link = Array.isArray(item.routerLink)
      ? (item.routerLink as string[]).join('/')
      : ((item.routerLink as string) ?? '');
    return link || (item.label ?? '');
  }

  toggleExpanded(item: MenuItem): void {
    const key = this.menuKey(item);
    const next = new Set(this.expandedMenuKeys());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.expandedMenuKeys.set(next);
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedMenuKeys().has(this.menuKey(item));
  }

  goHome() {
    this.router.navigate(['home']);
  }

  // ─── Drag from sidebar ─────────────────────────────────────────────────────

  onMenuItemDragStart(event: DragEvent, item: MenuItem): void {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(
      'application/bifi-shortcut',
      JSON.stringify({
        type: 'menu-item',
        label: this.translationService.translate(
          item['label'] as string,
          {},
          item['scope'] as string
        ),
        icon: item['icon'],
        routerLink: item['routerLink'],
        resource: item['resource'],
      })
    );
    const link = ((item['routerLink'] as string[]) ?? []).join('/').replace(/^\//, '');
    this.draggedItemModule.set(link || null);
  }

  // ─── Drag within shortcuts bar (reorder) ───────────────────────────────────

  onShortcutDragStart(event: DragEvent, shortcut: ShortcutItem, filteredIndex: number): void {
    if (!event.dataTransfer) return;
    const fullIndex = this.userShortcutsService
      .shortcuts()
      .findIndex(s => s.routerLink?.join('/') === shortcut.routerLink?.join('/'));
    this.dragSourceIndex = fullIndex !== -1 ? fullIndex : filteredIndex;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/bifi-shortcut',
      JSON.stringify({ type: 'reorder', index: this.dragSourceIndex })
    );
  }

  onShortcutDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverIndex.set(index);
  }

  // ─── Shortcuts bar drop zone ───────────────────────────────────────────────

  onBarDragOver(event: DragEvent): void {
    event.preventDefault();
    const descendantLinks = this.activeDescendantLinks();
    const draggedLink = this.draggedItemModule();
    const rejected = !!descendantLinks && draggedLink !== null && !descendantLinks.has(draggedLink);
    if (rejected) {
      this.isDragRejected.set(true);
      this.isDragOver.set(false);
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
    } else {
      this.isDragRejected.set(false);
      this.isDragOver.set(true);
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    }
  }

  onBarDragLeave(event: DragEvent): void {
    const bar = event.currentTarget as HTMLElement;
    if (!bar.contains(event.relatedTarget as Node)) {
      this.isDragOver.set(false);
      this.isDragRejected.set(false);
      this.draggedItemModule.set(null);
      this.dragOverIndex.set(null);
    }
  }

  onBarDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    this.isDragRejected.set(false);
    this.draggedItemModule.set(null);
    const raw = event.dataTransfer?.getData('application/bifi-shortcut');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.type === 'menu-item') {
        const descendantLinks = this.activeDescendantLinks();
        if (descendantLinks) {
          const link = (data.routerLink ?? []).join('/').replace(/^\//, '');
          if (!descendantLinks.has(link)) return;
        }
        if (this.filteredShortcuts().length >= 6) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translationService.translate('shortcuts.limitSummary', {}, 'base-app/ui'),
            detail: this.translationService.translate('shortcuts.limitDetail', {}, 'base-app/ui'),
          });
          return;
        }
        this.userShortcutsService.addShortcut({
          label: data.label,
          icon: data.icon,
          routerLink: data.routerLink,
          resource: data.resource,
        });
      } else if (data.type === 'reorder' && this.dragSourceIndex !== null) {
        const filtered = this.filteredShortcuts();
        const all = this.userShortcutsService.shortcuts();
        const filteredTargetIdx = this.dragOverIndex() ?? filtered.length;
        const targetShortcut = filtered[filteredTargetIdx];
        const fullTargetIndex = targetShortcut
          ? all.findIndex(s => s.routerLink?.join('/') === targetShortcut.routerLink?.join('/'))
          : all.length;
        this.userShortcutsService.moveShortcut(
          this.dragSourceIndex,
          fullTargetIndex !== -1 ? fullTargetIndex : all.length
        );
        this.dragSourceIndex = null;
        this.dragOverIndex.set(null);
      }
    } catch {
      // ignore invalid drag data
    }
  }
}
