import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { injectAuthService } from '@avalantec/base-app/auth';

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  body: string;
  link: string;
  module: string;
  read: boolean;
  seen: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationCenterService {
  private http = inject(HttpClient);
  private apiURL = inject(LIBRARY_CONFIG).apiURL;
  private auth = injectAuthService();

  unreadCount = signal(0);
  byModule = signal<Record<string, number>>({});
  notifications = signal<AppNotification[]>([]);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private router = inject(Router);

  constructor() {
    // Start polling once user is logged in, stop on logout
    let wasLoggedIn = false;
    setInterval(() => {
      const loggedIn = !!this.auth.user();
      if (loggedIn && !wasLoggedIn) {
        this.refresh();
        this.startPolling();
      } else if (!loggedIn && wasLoggedIn) {
        this.stopPolling();
        this.unreadCount.set(0);
        this.byModule.set({});
        this.notifications.set([]);
      }
      wasLoggedIn = loggedIn;
    }, 1000);

    // Refresh on every navigation so badges update immediately when the user
    // navigates between pages rather than waiting for the next poll cycle
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.auth.user()) this.refresh();
      });
  }

  private get base(): string {
    const url = this.apiURL;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  async refresh(): Promise<void> {
    if (!this.auth.user()) return;
    try {
      const [countRes, notifRes] = await Promise.all([
        firstValueFrom(
          this.http.get<{ total: number; byModule: Record<string, number> }>(
            `${this.base}/notifications/unread-count`,
            { headers: { 'Cache-Control': 'no-cache' } }
          )
        ),
        firstValueFrom(
          this.http.get<AppNotification[]>(
            `${this.base}/notifications?limit=20`,
            { headers: { 'Cache-Control': 'no-cache' } }
          )
        ),
      ]);
      this.unreadCount.set(countRes?.total ?? 0);
      this.byModule.set(countRes?.byModule ?? {});
      this.notifications.set(Array.isArray(notifRes) ? notifRes : []);
    } catch {
      // silent — network issues shouldn't break the UI
    }
  }

  async markRead(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.base}/notifications/${id}/read`, {})
      );
      this.notifications.update(list =>
        list.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      this.unreadCount.update(c => Math.max(0, c - 1));
      // Refresh for accurate byModule counts
      await this.refresh();
    } catch {
      // silent
    }
  }

  async markAllSeen(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.base}/notifications/mark-all-seen`, {})
      );
      this.notifications.update(list => list.map(n => ({ ...n, seen: true })));
      this.unreadCount.set(0);
      // byModule stays intact — tile badges clear only when records are visited
    } catch {
      // silent
    }
  }

  async markAllRead(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.base}/notifications/mark-all-read`, {})
      );
      this.notifications.update(list => list.map(n => ({ ...n, read: true, seen: true })));
      this.unreadCount.set(0);
      this.byModule.set({});
    } catch {
      // silent
    }
  }

  private startPolling(): void {
    this.stopPolling();
    this.intervalId = setInterval(() => this.refresh(), 60_000);
  }

  private stopPolling(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
