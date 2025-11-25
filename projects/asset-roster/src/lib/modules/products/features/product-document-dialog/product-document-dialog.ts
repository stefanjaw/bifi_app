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
  selector: 'bifi-app-product-document-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FileUploadModule,
    FormModule,
  ],
  templateUrl: './product-document-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddDocumentFormDialog extends BaseDialog {
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

  /**
   * Opens the product form dialog and resets the form to its initial state.
   * This ensures that any previously entered data is cleared when the dialog
   * is opened anew.
   */

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  /**
   * Handles the change event of the descriptor select element and updates the descriptor value in the form.
   * @param value the selected descriptor value
   */
  handleDescriptorChange(value: string) {
    this.descriptorSelectValue.set(value);
  }

  /**
   * Handles the submission of the form and creates a new commissioning record in the backend.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<addDocumentFormModel>) {
    console.log('submitting', data.rawValue);
    this.submitted.emit(data.rawValue);
    this.closeDialog();
  }
}
