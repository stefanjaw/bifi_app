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
import { DebugManager, SidenavManager, ToolbarManager } from '@avalantec/base-app/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { UserPanel } from '../user-panel/user-panel';
import { HasPermission, injectAuthService } from '@avalantec/base-app/auth';
import { RippleModule } from 'primeng/ripple';
import { MainMenuManager, ShortcutItem, UserShortcutsService } from '@avalantec/base-app/routing';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
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
    PanelMenuModule,
    RippleModule,
    HasPermission,
    RouterLink,
    TooltipModule,
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
  private menuManager = inject(MainMenuManager);
  menuItems = this.menuManager.menuItems;

  // toolbar management
  private toolbarManager = inject(ToolbarManager);
  toolbarItems = this.toolbarManager.toolbarItems;

  // check if logged
  isLogged = computed(() => !!this.user());

  // shortcuts
  userShortcutsService = inject(UserShortcutsService);

  // current route
  currentRoute = signal(this.router.url);

  // drag state
  isDragOver = signal(false);
  dragOverIndex = signal<number | null>(null);
  private dragSourceIndex: number | null = null;

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
        label: item['label'],
        icon: item['icon'],
        routerLink: item['routerLink'],
        resource: item['resource'],
      })
    );
  }

  // ─── Drag within shortcuts bar (reorder) ───────────────────────────────────

  onShortcutDragStart(event: DragEvent, index: number): void {
    if (!event.dataTransfer) return;
    this.dragSourceIndex = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/bifi-shortcut',
      JSON.stringify({ type: 'reorder', index })
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
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    this.isDragOver.set(true);
  }

  onBarDragLeave(event: DragEvent): void {
    const bar = event.currentTarget as HTMLElement;
    if (!bar.contains(event.relatedTarget as Node)) {
      this.isDragOver.set(false);
      this.dragOverIndex.set(null);
    }
  }

  onBarDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const raw = event.dataTransfer?.getData('application/bifi-shortcut');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.type === 'menu-item') {
        this.userShortcutsService.addShortcut({
          label: data.label,
          icon: data.icon,
          routerLink: data.routerLink,
          resource: data.resource,
        });
      } else if (data.type === 'reorder' && this.dragSourceIndex !== null) {
        const targetIndex = this.dragOverIndex() ?? this.userShortcutsService.shortcuts().length;
        this.userShortcutsService.moveShortcut(this.dragSourceIndex, targetIndex);
        this.dragSourceIndex = null;
        this.dragOverIndex.set(null);
      }
    } catch {
      // ignore invalid drag data
    }
  }
}
