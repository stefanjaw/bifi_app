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
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-asset-roster-document-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FileUploadModule,
    FormModule,
    TranslatePipe,
  ],
  templateUrl: './asset-roster-document-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterAddDocumentFormDialog extends BaseDialog {
  // services
  private formService = inject(AddDocumentForm);
  private translationService = inject(TranslationService);
  form = this.formService.form;

  // outputs
  submitted = output<addDocumentFormModel>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);

  descriptorSelectValue = signal<string>('');
  isOther = computed(() => this.descriptorSelectValue() === 'Other');

  descriptorOptions = computed(() => [
    {
      label: this.translationService.translate('descriptor.technicalManual', {}, 'asset-roster'),
      value: 'Technical Manual',
    },
    {
      label: this.translationService.translate('descriptor.userManual', {}, 'asset-roster'),
      value: 'User Manual',
    },
    {
      label: this.translationService.translate('descriptor.purchaseInvoice', {}, 'asset-roster'),
      value: 'Purchase Invoice',
    },
    {
      label: this.translationService.translate('descriptor.trainingMaterial', {}, 'asset-roster'),
      value: 'Training Material',
    },
    {
      label: this.translationService.translate('descriptor.safetyInstructions', {}, 'asset-roster'),
      value: 'Safety Instructions',
    },
    {
      label: this.translationService.translate('descriptor.other', {}, 'asset-roster'),
      value: 'Other',
    },
  ]);

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
