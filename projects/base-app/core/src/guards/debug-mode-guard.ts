import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { DebugManager } from '../services/debug-manager';

export const debugModeGuard: CanActivateFn = () => {
  const debugManager = inject(DebugManager);
  const router = inject(Router);

  if (!debugManager.debugEnable()) {
    return router.parseUrl('/');
  }

  return true;
};
