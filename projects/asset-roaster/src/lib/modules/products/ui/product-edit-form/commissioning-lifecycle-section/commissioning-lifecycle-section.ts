import { Component, input, output } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { product } from '../../../interfaces/product';

@Component({
  selector: 'bifi-app-commissioning-lifecycle-section',
  imports: [...AppFormExtensionsImports, ButtonModule, CardModule],
  templateUrl: './commissioning-lifecycle-section.html',
})
export class CommissioningLifecycleSection {
  product = input.required<product | null>();
  isEditMode = input.required<boolean>();

  // outputs
  commission = output<void>();
  decomission = output<void>();
}
