import { inject } from '@angular/core';
import { PluginManager } from '@avalantec/base-app/plugin-system';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';
import { ContactCrPlugin } from '../../features/contact-cr-plugin/contact-cr-plugin';
import { ProductCrPlugin } from '../../features/product-cr-plugin/product-cr-plugin';
import { UomCrPlugin } from '../../features/uom-cr-plugin/uom-cr-plugin';
import { DiscountCrPlugin } from '../../features/discount-cr-plugin/discount-cr-plugin';
import { TaxCrPlugin } from '../../features/tax-cr-plugin/tax-cr-plugin';
import { InvoiceCrPlugin } from '../../features/invoice-cr-plugin/invoice-cr-plugin';
import { InvoiceImportPlugin } from '../../features/invoice-import-plugin/invoice-import-plugin';
import { CR_EINVOICE_SETTINGS_ROUTES } from '../../modules/cr-einvoice-settings/routes/cr-einvoice-settings.routes';
import { CONDICION_VENTA_ROUTES } from '../../modules/condicion-venta/routes/condicion-venta.routes';
import { MEDIO_PAGO_ROUTES } from '../../modules/medio-pago/routes/medio-pago.routes';

export function initializeL10nCrEinvoice() {
  const pluginManager = inject(PluginManager);
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  pluginManager.register([
    {
      slot: 'contacts-form-general-information',
      component: ContactCrPlugin,
    },
    {
      slot: 'product-form-general-information',
      component: ProductCrPlugin,
    },
    {
      slot: 'uom-form-general-information',
      component: UomCrPlugin,
    },
    {
      slot: 'discount-form-general-information',
      component: DiscountCrPlugin,
    },
    {
      slot: 'tax-form-general-information',
      component: TaxCrPlugin,
    },
    {
      slot: 'invoice-form-general-information',
      component: InvoiceCrPlugin,
    },
    {
      slot: 'invoices-list-actions',
      component: InvoiceImportPlugin,
    },
  ]);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'CR E-Invoice',
        resource: 'cr-einvoice/settings/menu',
        items: [
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/cr-einvoice/configuracion'],
            label: 'Configuration',
            resource: 'cr-einvoice/settings/menu',
          },
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/cr-einvoice/condicion-venta'],
            label: 'Condición de Venta',
            resource: 'cr-einvoice/condicion-venta/menu',
          },
          {
            icon: PrimeIcons.WALLET,
            routerLink: ['/settings/cr-einvoice/medio-pago'],
            label: 'Medio de Pago',
            resource: 'cr-einvoice/medio-pago/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'cr-einvoice',
      children: [
        {
          path: 'configuracion',
          children: CR_EINVOICE_SETTINGS_ROUTES,
        },
        {
          path: 'condicion-venta',
          children: CONDICION_VENTA_ROUTES,
        },
        {
          path: 'medio-pago',
          children: MEDIO_PAGO_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
