import { inject } from '@angular/core';
import { ASSET_ROASTER_ROUTES } from '../../routes/asset-roaster.routes';
import { PrimeIcons } from 'primeng/api';
import { MainMenuManager } from '@avalantec/base-app/routing';
import {
  FACILITIES_ROUTES,
  MAINTENANCE_WINDOWS_ROUTES,
  PRODUCT_TYPES_ROUTES,
  ROOMS_ROUTES,
} from '../../modules';
import { ResourceList } from '@avalantec/base-app/roles';

export function initializeAssetRoster() {
  initializeMenu();
  initializeResources();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);

  // main menu
  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.OBJECTS_COLUMN,
      routerLink: ['/asset-roster'],
      label: 'Asset Roster',
      resource: 'products',
      showInMainMenu: true,
    },
    routes: ASSET_ROASTER_ROUTES,
  });

  // settigns
  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.CLOCK,
      routerLink: ['/settings/maintenance-windows'],
      label: 'Maintenance Windows',
      resource: 'maintenance-windows',
    },
    route: {
      path: 'maintenance-windows',
      children: MAINTENANCE_WINDOWS_ROUTES,
    },
    childOf: 'settings',
  });

  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.BUILDING,
      routerLink: ['/settings/rooms'],
      label: 'Rooms',
      resource: 'rooms',
    },
    route: {
      path: 'rooms',
      children: ROOMS_ROUTES,
    },
    childOf: 'settings',
  });

  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.ADDRESS_BOOK,
      routerLink: ['/settings/facilities'],
      label: 'Facilities',
      resource: 'facilities',
    },
    route: {
      path: 'facilities',
      children: FACILITIES_ROUTES,
    },
    childOf: 'settings',
  });

  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.LIST,
      routerLink: ['/settings/product-types'],
      label: 'Equipment Types',
      resource: 'productTypes',
    },
    route: {
      path: 'product-types',
      children: PRODUCT_TYPES_ROUTES,
    },
    childOf: 'settings',
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
