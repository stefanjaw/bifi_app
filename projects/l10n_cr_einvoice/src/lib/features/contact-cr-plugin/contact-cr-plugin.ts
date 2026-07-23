import { Component, effect, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ContactsForm } from '@avalantec/base-app/contacts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-app-contact-cr-plugin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
  ],
  template: `
    <ng-container [formGroup]="hostForm">
      <div class="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Costa Rica (CR)</h3>
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

        <bifi-app-form-field>
          <bifi-app-form-label>Distrito (CR)</bifi-app-form-label>
          <input pInputText formControlName="crDistrito" placeholder="e.g. 01" />
          <bifi-app-form-error></bifi-app-form-error>
        </bifi-app-form-field>

        <div class="flex flex-col gap-2 text-base">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium leading-none flex items-center gap-1"
              >Economic Activity Codes</label
            >
            <button
              pButton
              type="button"
              icon="pi pi-plus"
              severity="secondary"
              size="small"
              (click)="addActivity()"
            ></button>
          </div>
          <div formArrayName="crEconomicActivityCodes">
            @for (ctrl of activitiesArray.controls; track $index) {
              <div [formGroupName]="$index" class="flex gap-2 items-center mt-2">
                <input pInputText formControlName="code" placeholder="Code" class="w-24" />
                <input
                  pInputText
                  formControlName="description"
                  placeholder="Description"
                  class="flex-1"
                />
                <button
                  pButton
                  type="button"
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  (click)="removeActivity($index)"
                ></button>
              </div>
            }
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class ContactCrPlugin implements OnInit {
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
    this.hostForm.addControl('crDistrito', new FormControl(''));
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
        this.hostForm.patchValue({ crVatType: '', commercialName: '', crDistrito: '' });
        if (codes) codes.clear();
        return;
      }

      this.hostForm.patchValue({
        crVatType: (contact as any)?.crVatType ?? '',
        commercialName: (contact as any)?.commercialName ?? '',
        crDistrito: (contact as any)?.crDistrito ?? '',
      });

      if (codes) {
        codes.clear();
        const activities: any[] = (contact as any)?.crEconomicActivityCodes ?? [];
        activities.forEach((act: any) => {
          codes.push(
            this.fb.group({ code: [act.code ?? ''], description: [act.description ?? ''] })
          );
        });
      }
    });
  }
}
