import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudUsers } from '@avalantec/base-app/users';
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
  protected formService = inject(UpdateAssetRosterForm);
  private readonly crudUsers = inject(CrudUsers);

  userResource = this.crudUsers.getProfile();

  //data
  user = this.userResource.value;
  userAuthorNote = computed(() => this.user()?._id);
  
  assetRoster = input.required<assetRoster | undefined>();
  isEditMode = input.required<boolean>();
  // states
  form = this.formService.form;
  remarkTextModel = model<string>('');

  get notesControl() {
    return this.form.get('remarks') as FormArray;
  }
  getUserName(userId: string) {
    const user = this.userResource.value();
    return user?.contactId?.name;
  }

  addNote() {
    const text = this.remarkTextModel();
    if (!text?.trim()) return;
    const currentUser = this.userAuthorNote;
    this.formService.addRemark(text, currentUser());
    this.remarkTextModel.set('');
  }
}
