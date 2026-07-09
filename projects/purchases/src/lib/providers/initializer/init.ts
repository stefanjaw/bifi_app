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
        label: 'nav.purchases',
        resource: 'purchases/menu',
        scope: 'purchases',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.USERS,
            routerLink: ['/purchases/suppliers'],
            label: 'nav.suppliers',
            resource: 'purchases/suppliers/menu',
            scope: 'purchases',
          },
          {
            icon: PrimeIcons.FILE_EDIT,
            routerLink: ['/purchases/orders'],
            label: 'nav.purchaseOrders',
            resource: 'purchases/orders/menu',
            scope: 'purchases',
          },
          {
            icon: PrimeIcons.TH_LARGE,
            routerLink: ['/purchases/pipeline'],
            label: 'nav.pipeline',
            resource: 'purchases/pipeline/menu',
            scope: 'purchases',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'nav.purchases',
        resource: 'purchases/settings/menu',
        scope: 'purchases',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/purchases/purchase-stages'],
            label: 'nav.purchaseStages',
            resource: 'purchase-stages/menu',
            scope: 'purchases',
          },
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/purchases/configuration'],
            label: 'nav.configuration',
            resource: 'purchases/configuration/menu',
            scope: 'purchases',
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
