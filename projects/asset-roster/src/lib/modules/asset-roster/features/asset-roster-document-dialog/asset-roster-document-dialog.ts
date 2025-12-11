import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BaseDialog } from '@avalantec/base-app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { AddDocumentForm, addDocumentFormModel } from '../../services/add-document-form';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'bifi-app-asset-roster-document-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FileUploadModule,
    FormModule,
  ],
  templateUrl: './asset-roster-document-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterAddDocumentFormDialog extends BaseDialog {
  // services
  private formService = inject(AddDocumentForm);
  form = this.formService.form;

  // outputs
  submitted = output<addDocumentFormModel>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);

  descriptorSelectValue = signal<string>('');
  isOther = computed(() => this.descriptorSelectValue() === 'Other');

  descriptorOptions = [
    'Technical Manual',
    'User Manual',
    'Purchase Invoice',
    'Training Material',
    'Safety Instructions',
    'Other',
  ];

  constructor() {
    super();
    effect(() => {
      const isOtherDescriptor = this.descriptorSelectValue() === 'Other';
      if (!isOtherDescriptor) {
        this.form.controls.descriptor.patchValue(this.descriptorSelectValue());
      } else {
        this.form.controls.descriptor.patchValue('');
      }
    });
  }

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  handleDescriptorChange(value: string) {
    this.descriptorSelectValue.set(value);
  }

  handleSubmit(data: FormValueState<addDocumentFormModel>) {
    console.log('submitting', data.rawValue);
    this.submitted.emit(data.rawValue);
    this.closeDialog();
  }
}
