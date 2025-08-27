import { inject } from '@angular/core';
import { ASSET_ROASTER_ROUTES } from '../../routes/asset-roaster.routes';
import { ResourceList } from '@avalantec/base-app/settings';
import { PrimeIcons } from 'primeng/api';
import { MAINTENANCE_WINDOWS_ROUTES } from '../../modules/maintenance-windows/routes/maintenance-windows.routes';
import { MainMenuManager, SettingsMenuManager } from '@avalantec/base-app/src';
import { authGuard } from '@avalantec/base-app/auth';

export function initializeAssetRoster() {
  initializeMenu();
  initializeResources();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const settingsMenuManager = inject(SettingsMenuManager);

  mainMenuManager.addItem(
    {
      icon: PrimeIcons.OBJECTS_COLUMN,
      routerLink: ['/asset-roaster'],
      label: 'Asset Roaster',
    },
    ASSET_ROASTER_ROUTES
  );

  settingsMenuManager.addItem(
    {
      icon: PrimeIcons.CLOCK,
      routerLink: ['/maintenance-windows'],
      label: 'Maintenance Windows',
    },
    MAINTENANCE_WINDOWS_ROUTES,
    {
      path: 'maintenance-windows',
      canActivate: [authGuard],
      loadComponent: () => import('@avalantec/base-app/settings').then(m => m.SettingsMainMenu),
    }
  );
}

function initializeResources() {
  const resourceList = inject(ResourceList);
  resourceList.add([
    {
      name: 'facilities',
      keySuggesstions: [
        { key: '_id', name: 'ID' },
        { key: 'name', name: 'Name' },
      ],
    },
    {
      name: 'products',
      keySuggesstions: [
        { key: '_id', name: 'ID' },
        { key: 'name', name: 'Name' },
        { key: 'status', name: 'Status' },
      ],
    },
  ]);
}
