import { inject } from '@angular/core';
import { PluginManager } from '@avalantec/base-app/plugin-system';
import { VatTypePluginComponent } from '../../features/vat-type-plugin/vat-type-plugin';
import { CommercialNamePluginComponent } from '../../features/commercial-name-plugin/commercial-name-plugin';

export function initializeL10nCrEinvoice() {
  const pluginManager = inject(PluginManager);

  pluginManager.register([
    {
      slot: 'contacts-form-general-information',
      component: VatTypePluginComponent,
    },
    {
      slot: 'contacts-form-general-information',
      component: CommercialNamePluginComponent,
    },
  ]);
}
