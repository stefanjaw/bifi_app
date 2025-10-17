import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

interface ToastAction {
  label: string;
  onClick?: () => void;
}

interface ToastConfig {
  id?: string | number;
  description?: string;
  duration?: number;
  action?: ToastAction;
}

@Injectable({
  providedIn: 'root',
})
export class ToastManager {
  private defaultAction(config?: ToastConfig): ToastAction {
    return {
      label: 'x',
      onClick: () => {
        // intentar cerrar por id si existe, si no cerrar todo
        try {
          if (config?.id) {
            (toast as any).dismiss?.(config.id);
          } else {
            (toast as any).dismiss?.();
          }
        } catch {
          // no hacer nada si la API no tiene dismiss
        }
      },
    };
  }

  /**
   * Show a success toast notification.
   *
   * @param message The success message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showSuccess(message: string, config?: ToastConfig) {
    return toast.success(message, {
      ...config,
      action: config?.action ?? this.defaultAction(config),
    } as any);
  }

  /**
   * Show a loading toast notification.
   *
   * @param message The message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showLoading(message: string, config?: ToastConfig) {
    return toast.loading(message, {
      ...config,
      action: config?.action ?? this.defaultAction(config),
    } as any);
  }

  /**
   * Show an error toast notification.
   *
   * @param message The error message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showError(message: string, config?: ToastConfig) {
    return toast.error(message, {
      ...config,
      action: config?.action ?? this.defaultAction(config),
    } as any);
  }

  /**
   * Show an information toast notification.
   *
   * @param message The message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showInfo(message: string, config?: ToastConfig) {
    return toast.info(message, {
      ...config,
      action: config?.action ?? this.defaultAction(config),
    } as any);
  }

  /**
   * Show a warning toast notification.
   *
   * @param message The warning message to be shown inside the toast.
   * @param config Optional configuration for the toast.
   */
  showWarning(message: string, config?: ToastConfig) {
    return toast.warning(message, {
      ...config,
      action: config?.action ?? this.defaultAction(config),
    } as any);
  }

  /**
   * Clear all toast notifications.
   */
  clear() {
    // intentar varias APIs posibles de la librería
    try {
      (toast as any).dismiss?.();
      (toast as any).clear?.();
    } catch {
      // no hacer nada si la API no tiene dismiss o clear
    }
  }
}
