import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

interface ToastConfig {
  id?: string | number;
  description?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastManager {
  /**
   * Show a success toast notification.
   *
   * @param message The success message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showSuccess(message: string, config?: ToastConfig) {
    return toast.success(message, config);
  }

  /**
   * Show a loading toast notification.
   *
   * @param message The message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showLoading(message: string, config?: ToastConfig) {
    return toast.loading(message, config);
  }

  /**
   * Show an error toast notification.
   *
   * @param message The error message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showError(message: string, config?: ToastConfig) {
    return toast.error(message, config);
  }

  /**
   * Show an information toast notification.
   *
   * @param message The message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showInfo(message: string, config?: ToastConfig) {
    return toast.info(message, config);
  }

  /**
   * Show a warning toast notification.
   *
   * @param message The warning message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showWarning(message: string, config?: ToastConfig) {
    return toast.warning(message, config);
  }

  /**
   * Clear all toast notifications.
   */
  clear() {
    // Clear all toast notifications
  }
}
