import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { TaxForm } from '@avalantec/accounting';

@Component({
  selector: 'bifi-app-tax-cr-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, SelectModule, InputNumberModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <div class="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Costa Rica (CR)</h3>

        <bifi-app-form-field>
          <bifi-app-form-label>CR Código Impuesto</bifi-app-form-label>
          <p-select
            formControlName="crCodigo"
            [options]="codigoImpuestoOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccionar tipo"
          ></p-select>
          <bifi-app-form-error></bifi-app-form-error>
        </bifi-app-form-field>

        <bifi-app-form-field>
          <bifi-app-form-label>CR Código Tarifa IVA</bifi-app-form-label>
          <p-select
            formControlName="crCodigoTarifa"
            [options]="codigoTarifaOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccionar tarifa"
          ></p-select>
          <bifi-app-form-error></bifi-app-form-error>
        </bifi-app-form-field>

        <bifi-app-form-field>
          <bifi-app-form-label>CR Tarifa (%)</bifi-app-form-label>
          <p-inputNumber
            formControlName="crTarifa"
            [minFractionDigits]="2"
            [maxFractionDigits]="2"
          />
          <bifi-app-form-error></bifi-app-form-error>
        </bifi-app-form-field>
      </div>
    </ng-container>
  `,
})
export class TaxCrPlugin implements OnInit {
  host = inject<TaxForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

  codigoImpuestoOptions = [
    { value: '01', label: '01 – IVA' },
    { value: '02', label: '02 – Impuesto Selectivo de Consumo' },
    { value: '03', label: '03 – Impuesto Único a los Combustibles' },
    { value: '04', label: '04 – Impuesto específico de Bebidas Alcohólicas' },
    {
      value: '05',
      label: '05 – Impuesto Específico s/ bebidas envasadas sin alcohol y jabones de tocador',
    },
    { value: '06', label: '06 – Impuesto a los Productos de Tabaco' },
    { value: '07', label: '07 – IVA (cálculo especial)' },
    { value: '08', label: '08 – IVA Régimen de Bienes Usados (Factor)' },
    { value: '12', label: '12 – Impuesto específico al cemento' },
    { value: '99', label: '99 – Otros' },
  ];

  codigoTarifaOptions = [
    { value: '01', label: '01 – Tarifa 0% (No Sujeto)' },
    { value: '02', label: '02 – Tarifa reducida 1%' },
    { value: '03', label: '03 – Tarifa reducida 2%' },
    { value: '04', label: '04 – Tarifa reducida 4%' },
    { value: '05', label: '05 – Transitorio 0%' },
    { value: '06', label: '06 – Transitorio 4%' },
    { value: '07', label: '07 – Transitorio 8%' },
    { value: '08', label: '08 – Tarifa general 13%' },
    { value: '09', label: '09 – Tarifa reducida 2% (Ley 9635)' },
    { value: '10', label: '10 – Exento (Ley 9635 Art.8)' },
    { value: '11', label: '11 – No Sujeto IVA (Art. 9 bis)' },
    { value: '13', label: '13 – Tarifa reducida 1% (canasta básica)' },
  ];

  ngOnInit() {
    this.hostForm.addControl('crCodigo', new FormControl(''));
    this.hostForm.addControl('crCodigoTarifa', new FormControl(''));
    this.hostForm.addControl('crTarifa', new FormControl(0));
  }

  constructor() {
    effect(() => {
      const tax = this.host.taxResource.value();
      if (!tax) {
        this.hostForm.patchValue({ crCodigo: '', crCodigoTarifa: '', crTarifa: 0 });
        return;
      }
      this.hostForm.patchValue({
        crCodigo: (tax as any)?.crCodigo ?? '',
        crCodigoTarifa: (tax as any)?.crCodigoTarifa ?? '',
        crTarifa: (tax as any)?.crTarifa ?? 0,
      });
    });
  }
}
