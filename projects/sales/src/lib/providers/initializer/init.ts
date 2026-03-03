import { inject } from '@angular/core';
import { SALES_ROUTES } from '../../routes/sales.routes';
import { CRM_STAGES_ROUTES } from '../../modules/crm-stages/routes/crm-stages.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializeSales() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.DOLLAR,
        routerLink: ['/sales'],
        label: 'Sales',
        resource: 'sales/menu',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.TH_LARGE,
            routerLink: ['/sales/dashboard'],
            label: 'Dashboard',
            resource: 'sales/dashboard/menu',
          },
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/sales/opportunities'],
            label: 'Opportunities',
            resource: 'sales/opportunities/menu',
          },
          {
            icon: PrimeIcons.TABLE,
            routerLink: ['/sales/pipeline'],
            label: 'Pipeline',
            resource: 'sales/pipeline/menu',
          },
          {
            icon: PrimeIcons.SHOPPING_CART,
            routerLink: ['/sales/orders'],
            label: 'Orders',
            resource: 'sales/orders/menu',
          },
          {
            icon: PrimeIcons.FLAG,
            routerLink: ['/sales/targets/list'],
            label: 'Targets',
            resource: 'sales/targets/menu',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Sales',
        resource: 'sales/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/sales/crm-stages'],
            label: 'CRM Stages',
            resource: 'crm-stages/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'sales',
    newRouting: SALES_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'sales',
      children: [
        {
          path: 'crm-stages',
          children: CRM_STAGES_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
