import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { TaxForm } from '@avalantec/accounting';

@Component({
  selector: 'bifi-l10n-tax-cr-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, InputTextModule, InputNumberModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <bifi-app-form-field>
        <bifi-app-form-label>CR Código Impuesto</bifi-app-form-label>
        <input pInputText formControlName="crCodigo" placeholder="e.g. 01" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>

      <bifi-app-form-field>
        <bifi-app-form-label>CR Código Tarifa IVA</bifi-app-form-label>
        <input pInputText formControlName="crCodigoTarifa" placeholder="e.g. 08" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>

      <bifi-app-form-field>
        <bifi-app-form-label>CR Tarifa (%)</bifi-app-form-label>
        <p-inputNumber formControlName="crTarifa" [minFractionDigits]="2" [maxFractionDigits]="2" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>
  `,
})
export class TaxCrPlugin implements OnInit {
  host = inject<TaxForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

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
