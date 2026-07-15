import { inject } from '@angular/core';
import { INVENTORY_ROUTES, INVENTORY_SETTINGS_ROUTES } from '../../routes/inventory.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializeInventory() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.BOX,
        routerLink: ['/inventory'],
        label: 'inventory',
        resource: 'inventory/menu',
        scope: 'inventory',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.HOME,
            routerLink: ['/inventory/dashboard'],
            label: 'dashboard',
            resource: 'inventory/products/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.BUILDING,
            routerLink: ['/inventory/warehouses'],
            label: 'warehouses',
            resource: 'inventory/warehouses/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/inventory/products'],
            label: 'products',
            resource: 'inventory/products/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.SORT_ALT,
            routerLink: ['/inventory/movements'],
            label: 'movements',
            resource: 'inventory/movements/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.ARROWS_H,
            routerLink: ['/inventory/transfer'],
            label: 'transfer',
            resource: 'inventory/transfer/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.OBJECTS_COLUMN,
            routerLink: ['/inventory/uom-categories'],
            label: 'uomCategories',
            resource: 'inventory/uom-categories/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.CALCULATOR,
            routerLink: ['/inventory/uoms'],
            label: 'unitsOfMeasure',
            resource: 'inventory/uoms/menu',
            scope: 'inventory',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'inventory',
        resource: 'inventory/settings/menu',
        scope: 'inventory',
        items: [
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/inventory/configuration'],
            label: 'configuration',
            resource: 'inventory-settings/menu',
            scope: 'inventory',
          },
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/inventory/product-types'],
            label: 'productTypes',
            resource: 'inventory/product-types/menu',
            scope: 'inventory',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'inventory',
    newRouting: INVENTORY_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'inventory',
      children: INVENTORY_SETTINGS_ROUTES,
    },
    childOf: 'settings',
  });
}
