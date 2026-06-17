import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationCenterService, AppNotification } from '@avalantec/base-app/routing';

@Component({
  selector: 'bifi-app-notification-panel',
  imports: [CommonModule],
  templateUrl: './notification-panel.html',
})
export class NotificationPanel {
  protected notificationService = inject(NotificationCenterService);
  private router = inject(Router);
  private elRef = inject(ElementRef);

  open = signal(false);

  private panelEl = viewChild<ElementRef<HTMLDivElement>>('panel');

  togglePanel(): void {
    const next = !this.open();
    this.open.set(next);
    if (next) {
      this.notificationService.refresh();
      this.notificationService.markAllSeen();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }

  async openNotification(n: AppNotification): Promise<void> {
    this.open.set(false);
    if (!n.read) {
      await this.notificationService.markRead(n._id);
    }
    if (n.link) {
      this.router.navigateByUrl(n.link);
    }
  }

  get hasUnread(): boolean {
    return this.notificationService.notifications().some(n => !n.read);
  }

  async markAllRead(): Promise<void> {
    await this.notificationService.markAllRead();
  }

  iconClass(type: string): string {
    switch (type) {
      case 'invoice_paid':    return 'pi pi-check-circle text-green-600';
      case 'invoice_posted':  return 'pi pi-send text-indigo-600';
      case 'po_received':     return 'pi pi-box text-blue-600';
      case 'po_sent':         return 'pi pi-truck text-orange-600';
      case 'task_assigned':   return 'pi pi-clipboard text-purple-600';
      case 'ticket_assigned': return 'pi pi-headphones text-cyan-600';
      case 'ticket_resolved': return 'pi pi-check text-teal-600';
      case 'deal_won':        return 'pi pi-trophy text-yellow-600';
      default:                return 'pi pi-bell text-surface-500';
    }
  }

  iconBg(type: string): string {
    switch (type) {
      case 'invoice_paid':    return 'bg-green-100';
      case 'invoice_posted':  return 'bg-indigo-100';
      case 'po_received':     return 'bg-blue-100';
      case 'po_sent':         return 'bg-orange-100';
      case 'task_assigned':   return 'bg-purple-100';
      case 'ticket_assigned': return 'bg-cyan-100';
      case 'ticket_resolved': return 'bg-teal-100';
      case 'deal_won':        return 'bg-yellow-100';
      default:                return 'bg-surface-100';
    }
  }

  relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
