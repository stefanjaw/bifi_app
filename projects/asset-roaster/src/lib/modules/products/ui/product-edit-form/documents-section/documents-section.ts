import { Component, input, output } from '@angular/core';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'bifi-app-documents-section',
  imports: [...AppFormExtensionsImports, ButtonModule, CardModule],
  templateUrl: './documents-section.html',
})
export class DocumentsSection {
  isEditMode = input.required<boolean>();
  addDocument = output<void>();
}
