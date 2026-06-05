import { Component, effect, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ContactsForm } from '@avalantec/base-app/contacts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-l10n-contact-cr-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, SelectModule, InputTextModule, ButtonModule, CommonModule],
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

      <bifi-app-form-field>
        <bifi-app-form-label>Commercial Name</bifi-app-form-label>
        <input pInputText formControlName="commercialName" placeholder="Enter commercial name" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>

    <div class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <label class="font-medium text-gray-700">Economic Activity Codes</label>
        <button pButton type="button" icon="pi pi-plus" severity="secondary" size="small"
          (click)="addActivity()"></button>
      </div>
      <div [formGroup]="hostForm">
        <ng-container formArrayName="crEconomicActivityCodes">
          @for (ctrl of activitiesArray.controls; track $index) {
            <div [formGroupName]="$index" class="grid grid-cols-2 gap-2 mb-2 items-center">
              <input pInputText formControlName="code" placeholder="Code" />
              <div class="flex gap-1">
                <input pInputText formControlName="description" placeholder="Description" class="flex-1" />
                <button pButton type="button" icon="pi pi-trash" severity="danger" size="small"
                  (click)="removeActivity($index)"></button>
              </div>
            </div>
          }
        </ng-container>
      </div>
    </div>
  `,
})
export class ContactCrPluginComponent implements OnInit {
  host = inject<ContactsForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;
  private fb = inject(FormBuilder);

  vatTypeOptions = [
    { value: '01', label: '01 Cédula Física' },
    { value: '02', label: '02 Cédula Jurídica' },
    { value: '03', label: '03 DIMEX' },
    { value: '04', label: '04 NITE' },
    { value: '05', label: '05 Extranjero No Domiciliado' },
    { value: '06', label: '06 No Contribuyente' },
  ];

  get activitiesArray(): FormArray {
    return this.hostForm.get('crEconomicActivityCodes') as FormArray;
  }

  ngOnInit() {
    this.hostForm.addControl('crVatType', new FormControl(''));
    this.hostForm.addControl('commercialName', new FormControl(''));
    this.hostForm.addControl('crEconomicActivityCodes', this.fb.array([]));
  }

  addActivity() {
    this.activitiesArray.push(this.fb.group({ code: [''], description: [''] }));
  }

  removeActivity(index: number) {
    this.activitiesArray.removeAt(index);
  }

  constructor() {
    effect(() => {
      const contact = this.host.contact();
      const codes = this.hostForm.get('crEconomicActivityCodes') as FormArray;

      if (!contact) {
        this.hostForm.patchValue({ crVatType: '', commercialName: '' });
        if (codes) codes.clear();
        return;
      }

      this.hostForm.patchValue({
        crVatType: (contact as any)?.crVatType ?? '',
        commercialName: (contact as any)?.commercialName ?? '',
      });

      if (codes) {
        codes.clear();
        const activities: any[] = (contact as any)?.crEconomicActivityCodes ?? [];
        activities.forEach((act: any) => {
          codes.push(this.fb.group({ code: [act.code ?? ''], description: [act.description ?? ''] }));
        });
      }
    });
  }
}
