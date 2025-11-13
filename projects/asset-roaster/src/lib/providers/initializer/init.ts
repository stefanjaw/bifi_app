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
      resource: 'asset-roster/menu',
      showInMainMenu: true,
    },
    routes: ASSET_ROASTER_ROUTES,
  });

  // settigns
  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.COG,
      label: 'Asset Roster',
      resource: 'asset-roster/settings/menu',
      items: [
        {
          icon: PrimeIcons.CLOCK,
          routerLink: ['/settings/asset-roster/maintenance-windows'],
          label: 'Maintenance Windows',
          resource: 'maintenance-windows/menu',
        },
        {
          icon: PrimeIcons.BUILDING,
          routerLink: ['/settings/asset-roster/rooms'],
          label: 'Rooms',
          resource: 'rooms/menu',
        },
        {
          icon: PrimeIcons.ADDRESS_BOOK,
          routerLink: ['/settings/asset-roster/facilities'],
          label: 'Facilities',
          resource: 'facilities/menu',
        },
        {
          icon: PrimeIcons.LIST,
          routerLink: ['/settings/asset-roster/product-types'],
          label: 'Equipment Types',
          resource: 'product-types/menu',
        },
      ],
    },
    route: {
      path: 'asset-roster',
      children: [
        {
          path: 'maintenance-windows',
          children: MAINTENANCE_WINDOWS_ROUTES,
        },
        {
          path: 'rooms',
          children: ROOMS_ROUTES,
        },
        {
          path: 'facilities',
          children: FACILITIES_ROUTES,
        },
        {
          path: 'product-types',
          children: PRODUCT_TYPES_ROUTES,
        },
      ],
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
