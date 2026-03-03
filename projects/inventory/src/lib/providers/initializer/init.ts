import { inject } from '@angular/core';
import { INVENTORY_ROUTES } from '../../routes/inventory.routes';
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
        label: 'Inventory',
        resource: 'inventory/menu',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.BUILDING,
            routerLink: ['/inventory/warehouses'],
            label: 'Warehouses',
            resource: 'inventory/warehouses/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/inventory/products'],
            label: 'Products',
            resource: 'inventory/products/menu',
          },
          {
            icon: PrimeIcons.SORT_ALT,
            routerLink: ['/inventory/movements'],
            label: 'Movements',
            resource: 'inventory/movements/menu',
          },
          {
            icon: PrimeIcons.ARROWS_H,
            routerLink: ['/inventory/transfer'],
            label: 'Transfer',
            resource: 'inventory/transfer/menu',
          },
          {
            icon: PrimeIcons.OBJECTS_COLUMN,
            routerLink: ['/inventory/uom-categories'],
            label: 'UoM Categories',
            resource: 'inventory/uom-categories/menu',
          },
          {
            icon: PrimeIcons.CALCULATOR,
            routerLink: ['/inventory/uoms'],
            label: 'Units of Measure',
            resource: 'inventory/uoms/menu',
          },
        ],
      },
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'inventory',
    newRouting: INVENTORY_ROUTES,
  });
}
