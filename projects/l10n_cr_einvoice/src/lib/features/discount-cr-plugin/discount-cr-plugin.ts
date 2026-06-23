import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { DiscountForm } from '@avalantec/accounting';

@Component({
  selector: 'bifi-app-discount-cr-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, InputTextModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <bifi-app-form-field>
        <bifi-app-form-label>CR Naturaleza del Descuento</bifi-app-form-label>
        <input pInputText formControlName="crNaturalezaDescuento" placeholder="Naturaleza del descuento" />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>
  `,
})
export class DiscountCrPlugin implements OnInit {
  host = inject<DiscountForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

  ngOnInit() {
    this.hostForm.addControl('crNaturalezaDescuento', new FormControl(''));
  }

  constructor() {
    effect(() => {
      const discount = this.host.discountResource.value();
      if (!discount) {
        this.hostForm.patchValue({ crNaturalezaDescuento: '' });
        return;
      }
      this.hostForm.patchValue({
        crNaturalezaDescuento: (discount as any)?.crNaturalezaDescuento ?? '',
      });
    });
  }
}
