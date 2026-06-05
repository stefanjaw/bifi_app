import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { UomForm } from '@avalantec/inventory';

@Component({
  selector: 'bifi-l10n-uom-cr-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, InputTextModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <bifi-app-form-field>
        <bifi-app-form-label>CR Unidad de Medida</bifi-app-form-label>
        <input pInputText formControlName="crUnidadMedida" placeholder="e.g. Sp, Al, m, kg" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>
  `,
})
export class UomCrPluginComponent implements OnInit {
  host = inject<UomForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

  ngOnInit() {
    this.hostForm.addControl('crUnidadMedida', new FormControl(''));
  }

  constructor() {
    effect(() => {
      const uom = this.host.uomResource.value();
      if (!uom) {
        this.hostForm.patchValue({ crUnidadMedida: '' });
        return;
      }
      this.hostForm.patchValue({
        crUnidadMedida: (uom as any)?.crUnidadMedida ?? '',
      });
    });
  }
}
