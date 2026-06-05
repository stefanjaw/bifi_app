import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ProductForm } from '@avalantec/inventory';

@Component({
  selector: 'bifi-l10n-product-cr-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, SelectModule, InputTextModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <bifi-app-form-field>
        <bifi-app-form-label>Código Comercial (CR)</bifi-app-form-label>
        <input pInputText formControlName="codigoComercial" placeholder="Código comercial" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>

      <bifi-app-form-field>
        <bifi-app-form-label>Tipo de Producto (CR)</bifi-app-form-label>
        <p-select
          formControlName="productKind"
          [options]="productKindOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select type"
        ></p-select>
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>
  `,
})
export class ProductCrPluginComponent implements OnInit {
  host = inject<ProductForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

  productKindOptions = [
    { value: 'consumable', label: 'Consumable' },
    { value: 'service', label: 'Service' },
    { value: 'storable', label: 'Storable' },
  ];

  ngOnInit() {
    this.hostForm.addControl('codigoComercial', new FormControl(''));
    this.hostForm.addControl('productKind', new FormControl(''));
  }

  constructor() {
    effect(() => {
      const product = this.host.productResource.value();
      if (!product) {
        this.hostForm.patchValue({ codigoComercial: '', productKind: '' });
        return;
      }
      this.hostForm.patchValue({
        codigoComercial: (product as any)?.codigoComercial ?? '',
        productKind: (product as any)?.productKind ?? '',
      });
    });
  }
}
