import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastManager {
  messageService = inject(MessageService);

  /**
   * Show a success toast notification.
   *
   * @param message The message to be shown inside the toast.
   * @param title Optional title of the toast.
   */
  showSuccess(message: string, title?: string) {
    this.messageService.add({ severity: 'success', summary: title, detail: message });
  }

  /**
   * Show an error toast notification.
   *
   * @param message The error message to be shown inside the toast.
   * @param title Optional title of the toast.
   */
  showError(message: string, title?: string) {
    this.messageService.add({ severity: 'error', summary: title, detail: message });
  }

  /**
   * Show an informational toast notification.
   *
   * @param message The informational message to be shown inside the toast.
   * @param title Optional title of the toast.
   */
  showInfo(message: string, title?: string) {
    this.messageService.add({ severity: 'info', summary: title, detail: message });
  }

  /**
   * Show a warning toast notification.
   *
   * @param message The warning message to be shown inside the toast.
   * @param title Optional title of the toast.
   */
  showWarning(message: string, title?: string) {
    this.messageService.add({ severity: 'warn', summary: title, detail: message });
  }

  /**
   * Clear all toast notifications.
   */
  clear() {
    this.messageService.clear();
  }
}
