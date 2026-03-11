import { inject } from '@angular/core';
import { ACCOUNTING_ROUTES } from '../../routes/accounting-routes';
import { ACCOUNTING_CONFIGURATION_ROUTES } from '../../modules/accounting-configuration/routes/accounting-configuration.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializeAccounting() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: 'pi pi-calculator',
        routerLink: ['/accounting'],
        label: 'Accounting',
        resource: 'accounting/menu',
        showInMainMenu: true,
        items: [
          {
            icon: 'pi pi-list',
            routerLink: ['/accounting/accounts'],
            label: 'Accounts',
            resource: 'accounting/accounts/menu',
          },
          {
            icon: 'pi pi-book',
            routerLink: ['/accounting/journals'],
            label: 'Journals',
            resource: 'accounting/journals/menu',
          },
          {
            icon: 'pi pi-file-edit',
            routerLink: ['/accounting/journal-entries'],
            label: 'Journal Entries',
            resource: 'accounting/journal-entries/menu',
          },
          {
            icon: 'pi pi-credit-card',
            routerLink: ['/accounting/payments'],
            label: 'Payments',
            resource: 'accounting/payments/menu',
          },
          {
            icon: 'pi pi-percentage',
            routerLink: ['/accounting/taxes'],
            label: 'Taxes',
            resource: 'accounting/taxes/menu',
          },
          {
            icon: 'pi pi-tag',
            routerLink: ['/accounting/discounts'],
            label: 'Discounts',
            resource: 'accounting/discounts/menu',
          },
          {
            icon: 'pi pi-map',
            routerLink: ['/accounting/fiscal-positions'],
            label: 'Fiscal Positions',
            resource: 'accounting/fiscal-positions/menu',
          },
          {
            icon: 'pi pi-calendar',
            routerLink: ['/accounting/payment-terms'],
            label: 'Payment Terms',
            resource: 'accounting/payment-terms/menu',
          },
          {
            icon: 'pi pi-file-invoice',
            routerLink: ['/accounting/invoices'],
            label: 'Invoices',
            resource: 'accounting/invoices/menu',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Accounting',
        resource: 'accounting/settings/menu',
        items: [
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/accounting/configuration'],
            label: 'Configuration',
            resource: 'accounting/configuration/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'accounting',
    newRouting: ACCOUNTING_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'accounting',
      children: [
        {
          path: 'configuration',
          children: ACCOUNTING_CONFIGURATION_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
