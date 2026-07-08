import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model, signal } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { CrudUsers } from '@avalantec/base-app/users';
import { LocaleDatePipe, TranslatePipe } from '@avalantec/base-app/i18n';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { assetRoster } from '../../../interfaces/asset-roster';

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
    AccordionModule,
    SelectModule,
    FormModule,
    MessageModule,
    LocaleDatePipe,
    TranslatePipe,
  ],
  templateUrl: './notes-section.html',
})
export class NotesSection {
  protected formService = inject(UpdateAssetRosterForm);
  private readonly crudUsers = inject(CrudUsers);
  private remarksVersion = signal(0);
  readonly sortedNotes = computed(() => {
    this.remarksVersion(); // Trigger recomputation when remarksVersion changes
    return [...this.notesControl.controls]
      .filter(c => {
        const remark = c.value?.remark;
        return typeof remark === 'string' && remark.trim().length > 0;
      })
      .sort(
        (a, b) => new Date(b.value.performDate).getTime() - new Date(a.value.performDate).getTime()
      );
  });
  showAllNotes = signal(false);

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
    console.log('🚀 ~ NotesSection ~ getUserName ~ userId:', userId);
    const user = this.userResource.value();
    return user?.contactId?.name;
  }

  addNote() {
    const text = this.remarkTextModel();
    if (!text?.trim()) return;
    const currentUser = this.userAuthorNote;
    this.formService.addRemark(text, currentUser());
    this.remarkTextModel.set('');
    this.remarksVersion.update(v => v + 1);
  }
}
