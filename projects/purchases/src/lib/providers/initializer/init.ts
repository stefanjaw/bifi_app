import { inject } from '@angular/core';
import { PURCHASES_ROUTES } from '../../routes/purchases.routes';
import { PURCHASE_STAGES_ROUTES } from '../../modules/purchase-stages/routes/purchase-stages.routes';
import { PURCHASE_CONFIGURATION_ROUTES } from '../../modules/purchase-configuration/routes/purchase-configuration.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializePurchases() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.SHOPPING_CART,
        routerLink: ['/purchases'],
        label: 'Purchases',
        resource: 'purchases/menu',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.USERS,
            routerLink: ['/purchases/suppliers'],
            label: 'Suppliers',
            resource: 'purchases/suppliers/menu',
          },
          {
            icon: PrimeIcons.FILE_EDIT,
            routerLink: ['/purchases/orders'],
            label: 'Purchase Orders',
            resource: 'purchases/orders/menu',
          },
          {
            icon: PrimeIcons.TH_LARGE,
            routerLink: ['/purchases/pipeline'],
            label: 'Pipeline',
            resource: 'purchases/pipeline/menu',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Purchases',
        resource: 'purchases/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/purchases/purchase-stages'],
            label: 'Purchase Stages',
            resource: 'purchase-stages/menu',
          },
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/purchases/configuration'],
            label: 'Configuration',
            resource: 'purchases/configuration/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'purchases',
    newRouting: PURCHASES_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'purchases',
      children: [
        {
          path: 'purchase-stages',
          children: PURCHASE_STAGES_ROUTES,
        },
        {
          path: 'configuration',
          children: PURCHASE_CONFIGURATION_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
