import { CommonModule } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { assetRoster, UpdateAssetRosterForm } from 'projects/asset-roster/src/public-api';

@Component({
  selector: 'bifi-app-notes-section',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    CardModule,
    CommonModule,
    SelectModule,
    FormModule,
    MessageModule,
  ],
  templateUrl: './notes-section.html',
})
export class NotesSection {
  assetRoster = input.required<assetRoster | undefined>();
  isEditMode = input.required<boolean>();

  protected formService = inject(UpdateAssetRosterForm);
  notesControl = this.formService.form.controls.remarks;

  // states
  form = this.formService.form;
  remarkTextModel = model<string>('');
}
