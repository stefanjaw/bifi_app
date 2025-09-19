import { inject } from '@angular/core';
import { ASSET_ROASTER_ROUTES } from '../../routes/asset-roaster.routes';
import { ResourceList } from '@avalantec/base-app/settings';
import { PrimeIcons } from 'primeng/api';
import { MainMenuManager, SettingsMenuManager } from '@avalantec/base-app/routing';
import { FACILITIES_ROUTES, MAINTENANCE_WINDOWS_ROUTES, ROOMS_ROUTES } from '../../modules';
import { SidenavManager } from '@avalantec/base-app/core';

export function initializeAssetRoster() {
  initializeMenu();
  initializeResources();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const settingsMenuManager = inject(SettingsMenuManager);
  const sidenavManager = inject(SidenavManager);

  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.OBJECTS_COLUMN,
      routerLink: ['/asset-roaster'],
      label: 'Asset Roaster',
      resource: 'products',
    },
    routes: ASSET_ROASTER_ROUTES,
  });

  settingsMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.CLOCK,
      routerLink: ['/settings/maintenance-windows'],
      label: 'Maintenance Windows',
      resource: 'maintenance-windows',
      command: () => sidenavManager.closeSidenav(),
    },
    route: {
      path: 'maintenance-windows',
      children: MAINTENANCE_WINDOWS_ROUTES,
    },
  });

  settingsMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.BUILDING,
      routerLink: ['/settings/rooms'],
      label: 'Rooms',
      resource: 'rooms',
      command: () => sidenavManager.closeSidenav(),
    },
    route: {
      path: 'rooms',
      children: ROOMS_ROUTES,
    },
  });

  settingsMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.ADDRESS_BOOK,
      routerLink: ['/settings/facilities'],
      label: 'Facilities',
      resource: 'facilities',
      command: () => sidenavManager.closeSidenav(),
    },
    route: {
      path: 'facilities',
      children: FACILITIES_ROUTES,
    },
  });
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
