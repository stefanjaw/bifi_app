import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ContactsForm } from '@avalantec/base-app/contacts';

@Component({
  selector: 'bifi-l10n-vat-type-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, SelectModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <bifi-app-form-field>
        <bifi-app-form-label>CR VAT Type</bifi-app-form-label>
        <p-select
          formControlName="crVatType"
          [options]="vatTypeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select VAT Type"
        ></p-select>
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>
  `,
})
export class VatTypePluginComponent implements OnInit {
  host = inject<ContactsForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

  vatTypeOptions = [
    { value: '01', label: '01 Cédula Física' },
    { value: '02', label: '02 Cédula Jurídica' },
    { value: '03', label: '03 DIMEX' },
    { value: '04', label: '04 NITE' },
    { value: '05', label: '05 Extranjero No Domiciliado' },
    { value: '06', label: '06 No Contribuyente' },
  ];

  ngOnInit() {
    this.hostForm.addControl('crVatType', new FormControl(''));
  }

  constructor() {
    effect(() => {
      const contact = this.host.contact();
      const vatTypeControl = this.hostForm.get('crVatType');
      if (vatTypeControl) {
        vatTypeControl.setValue((contact as any)?.crVatType ?? '');
      }
    });
  }
}
