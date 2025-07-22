import { Component, input, output } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'bifi-app-commissioning-lifecycle-section',
  imports: [...AppFormExtensionsImports, ButtonModule, CardModule],
  templateUrl: './commissioning-lifecycle-section.html',
})
export class CommissioningLifecycleSection {
  isEditMode = input.required<boolean>();
  commission = output<void>();
}
