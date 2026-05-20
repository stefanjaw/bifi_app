import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ContactsForm } from '@avalantec/base-app/contacts';

@Component({
  selector: 'bifi-l10n-commercial-name-plugin',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, InputTextModule],
  template: `
    <ng-container [formGroup]="hostForm">
      <bifi-app-form-field>
        <bifi-app-form-label>Commercial Name</bifi-app-form-label>
        <input
          pInputText
          formControlName="commercialName"
          placeholder="Enter commercial name"
        />
        <bifi-app-form-error></bifi-app-form-error>
      </bifi-app-form-field>
    </ng-container>
  `,
})
export class CommercialNamePluginComponent implements OnInit {
  host = inject<ContactsForm>(PLUGIN_CONTEXT);
  hostForm = this.host.form as FormGroup<any>;

  ngOnInit() {
    this.hostForm.addControl('commercialName', new FormControl(''));
  }

  constructor() {
    effect(() => {
      const contact = this.host.contact();
      const commercialNameControl = this.hostForm.get('commercialName');
      if (commercialNameControl) {
        commercialNameControl.setValue((contact as any)?.commercialName ?? '');
      }
    });
  }
}
