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
        label: 'nav.accounting',
        resource: 'accounting/menu',
        scope: 'accounting',
        showInMainMenu: true,
        items: [
          {
            icon: 'pi pi-list',
            routerLink: ['/accounting/accounts'],
            label: 'nav.accounts',
            scope: 'accounting',
            resource: 'accounting/accounts/menu',
          },
          {
            icon: 'pi pi-book',
            routerLink: ['/accounting/journals'],
            label: 'nav.journals',
            scope: 'accounting',
            resource: 'accounting/journals/menu',
          },
          {
            icon: 'pi pi-file-edit',
            routerLink: ['/accounting/journal-entries'],
            label: 'nav.journalEntries',
            scope: 'accounting',
            resource: 'accounting/journal-entries/menu',
          },
          {
            icon: 'pi pi-credit-card',
            routerLink: ['/accounting/payments'],
            label: 'nav.payments',
            scope: 'accounting',
            resource: 'accounting/payments/menu',
          },
          {
            icon: 'pi pi-percentage',
            routerLink: ['/accounting/taxes'],
            label: 'nav.taxes',
            scope: 'accounting',
            resource: 'accounting/taxes/menu',
          },
          {
            icon: 'pi pi-tag',
            routerLink: ['/accounting/discounts'],
            label: 'nav.discounts',
            scope: 'accounting',
            resource: 'accounting/discounts/menu',
          },
          {
            icon: 'pi pi-map',
            routerLink: ['/accounting/fiscal-positions'],
            label: 'nav.fiscalPositions',
            scope: 'accounting',
            resource: 'accounting/fiscal-positions/menu',
          },
          {
            icon: 'pi pi-calendar',
            routerLink: ['/accounting/payment-terms'],
            label: 'nav.paymentTerms',
            scope: 'accounting',
            resource: 'accounting/payment-terms/menu',
          },
          {
            icon: 'pi pi-receipt',
            routerLink: ['/accounting/invoices'],
            label: 'nav.invoices',
            scope: 'accounting',
            resource: 'accounting/invoices/menu',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'nav.accounting',
        scope: 'accounting',
        resource: 'accounting/settings/menu',
        items: [
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/accounting/configuration'],
            label: 'nav.configuration',
            scope: 'accounting',
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
