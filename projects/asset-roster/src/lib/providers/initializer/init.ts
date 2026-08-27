import { inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import {
  FACILITIES_ROUTES,
  MAINTENANCE_WINDOWS_ROUTES,
  ASSET_TYPES_ROUTES,
  ASSET_CONDITIONS_ROUTES,
  ROOMS_ROUTES,
} from '../../modules';
import { ASSET_ROASTER_ROUTES } from '../../routes/asset-roster.routes';
// import { ResourceList } from '@avalantec/base-app/roles';

export function initializeAssetRoster() {
  initializeMenu();
  // initializeResources();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  // main menu
  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.OBJECTS_COLUMN,
        routerLink: ['/asset-roster'],
        label: 'assetRoster',
        resource: 'asset-roster/menu',
        scope: 'asset-roster',
        showInMainMenu: true,
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'assetRoster',
        resource: 'asset-roster/settings/menu',
        scope: 'asset-roster',
        items: [
          {
            icon: PrimeIcons.CLOCK,
            routerLink: ['/settings/asset-roster/maintenance-windows'],
            label: 'maintenanceWindows',
            resource: 'maintenance-windows/menu',
            scope: 'asset-roster',
          },
          {
            icon: PrimeIcons.BUILDING,
            routerLink: ['/settings/asset-roster/rooms'],
            label: 'rooms',
            resource: 'rooms/menu',
            scope: 'asset-roster',
          },
          {
            icon: PrimeIcons.ADDRESS_BOOK,
            routerLink: ['/settings/asset-roster/facilities'],
            label: 'facilities',
            resource: 'facilities/menu',
            scope: 'asset-roster',
          },
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/asset-roster/asset-types'],
            label: 'assetTypes',
            resource: 'asset-types/menu',
            scope: 'asset-roster',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/asset-roster/asset-conditions'],
            label: 'conditions',
            resource: 'asset-conditions/menu',
            scope: 'asset-roster',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  // main routing
  mainRoutingManager.addRouting({
    newRouting: ASSET_ROASTER_ROUTES,
    basePath: 'asset-roster',
  });

  // settings routing
  mainRoutingManager.addRouting({
    newRouting: {
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
          path: 'asset-types',
          children: ASSET_TYPES_ROUTES,
        },
        {
          path: 'asset-conditions',
          children: ASSET_CONDITIONS_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}

// function initializeResources() {
//   const resourceList = inject(ResourceList);
//   resourceList.add([
//     {
//       name: 'facilities',
//       keySuggesstions: [
//         { key: '_id', name: 'ID' },
//         { key: 'name', name: 'Name' },
//       ],
//     },
//     {
//       name: 'products',
//       keySuggesstions: [
//         { key: '_id', name: 'ID' },
//         { key: 'name', name: 'Name' },
//         { key: 'status', name: 'Status' },
//       ],
//     },
//   ]);
// }
