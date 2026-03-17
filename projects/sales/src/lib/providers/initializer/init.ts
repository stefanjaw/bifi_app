import { inject } from '@angular/core';
import { SALES_ROUTES } from '../../routes/sales.routes';
import { CRM_STAGES_ROUTES } from '../../modules/crm-stages/routes/crm-stages.routes';
import { SALES_CONFIGURATION_ROUTES } from '../../modules/sales-configuration/routes/sales-configuration.routes';
import { PRICING_SETTINGS_ROUTES } from '../../modules/pricing/routes/pricing-settings.routes';
import { PRICING_ESTIMATES_ROUTES } from '../../modules/pricing/routes/pricing-estimates.routes';
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
          {
            icon: PrimeIcons.CALCULATOR,
            routerLink: ['/pricing/estimates/new'],
            label: 'Estimated Pricing',
            resource: 'pricing-estimates/menu',
          },
          {
            icon: PrimeIcons.HISTORY,
            routerLink: ['/pricing/estimates/history'],
            label: 'Pricing History',
            resource: 'pricing-estimates/menu',
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
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/sales/configuration'],
            label: 'Configuration',
            resource: 'sales/configuration/menu',
          },
          {
            icon: PrimeIcons.CALCULATOR,
            routerLink: ['/settings/pricing/configuration'],
            label: 'Pricing Configuration',
            resource: 'pricing-settings/menu',
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
        {
          path: 'configuration',
          children: SALES_CONFIGURATION_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'pricing',
      children: [
        {
          path: 'configuration',
          children: PRICING_SETTINGS_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });

  mainRoutingManager.addRouting({
    basePath: 'pricing',
    newRouting: [
      {
        path: 'estimates',
        children: PRICING_ESTIMATES_ROUTES,
      },
    ],
  });
}
