import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  FormArray,
  FormArrayName,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms';
import { FormUploaderFile } from '@avalantec/base-app/form/src/interfaces/form-uploader-image';
import { ControlsOf } from '@avalantec/base-app/form/src/interfaces/typed-form-builder';
import { FileRemoveEvent, FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'bifi-app-form-uploader',
  imports: [FileUpload],
  templateUrl: './form-uploader.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUploader implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = inject(DestroyRef);
  private formArrayNameDirective = inject(ControlContainer, {
    self: true,
  }) as FormArrayName;

  /**
   * Gets the underlying FormArray instance for the file upload control.
   *
   * The type of the form array is a FormArray of FormGroup<ControlsOf<FormUploaderFile>>.
   * The ControlsOf<FormUploaderFile> represents the controls of the FormUploaderFile interface.
   * See the FormUploaderFile interface for more information.
   *
   * @returns The underlying FormArray instance.
   */
  get formArray(): FormArray<FormGroup<ControlsOf<FormUploaderFile>>> {
    return this.formArrayNameDirective.control;
  }

  // PrimeNG FileUpload component
  uploader = contentChild(FileUpload);

  /** Angular ControlValueAccessor logic */
  onTouchedFn = () => {
    // Function to be called when the control is touched
  };

  onChangeFn = (_value: FormUploaderFile[]) => {
    // Function to be called when the control value changes
  };

  protected formValue = signal<FormUploaderFile[]>([]);
  disabled = signal<boolean>(false);

  constructor() {
    effect(onCleanup => {
      const uploader = this.uploader();
      if (!uploader) {
        return;
      }

      const subscriptions: Subscription[] = [];

      console.log('[Form uploader] Effect on PrimeNG FileUpload');

      subscriptions.push(uploader.onSelect.subscribe(event => this.onPrimeFileSelect(event)));
      subscriptions.push(uploader.onClear.subscribe(() => this.onPrimeFileClear()));
      subscriptions.push(uploader.onRemove.subscribe(event => this.onPrimeFileRemove(event)));

      onCleanup(() => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
      });
    });
  }

  ngOnInit(): void {
    if (!(this.formArrayNameDirective instanceof FormArrayName)) {
      throw new Error('Form uploader must be used inside a form array');
    }
    this.syncPrimeNGFiles();

    this.onTouchedFn = () => {
      this.formArray.markAsTouched();
    };

    this.onChangeFn = (value: FormUploaderFile[]) => {
      // Create the necessary controls to match the required length
      if (value.length > this.formArray.length) {
        for (let i = this.formArray.length; i < value.length; i++) {
          this.formArray.push(this.createFileGroup(value[i]));
        }
      }

      // Remove controls that are not needed
      if (value.length < this.formArray.length) {
        for (let i = this.formArray.length - 1; i >= value.length; i--) {
          this.formArray.removeAt(i);
        }
      }

      // Update the value
      this.formArray.patchValue(value);
      this.formArray.markAsDirty();

      console.log('form array marked as dirty', {
        dirty: this.formArray.dirty,
        value: this.formArray.value,
      });
    };

    // Update the disabled state
    this.formArray.statusChanges
      .pipe(takeUntilDestroyed(this.destroy$), distinctUntilChanged())
      .subscribe(status => {
        if (status === 'DISABLED') {
          this.disabled.set(true);
        } else if (status === 'VALID') {
          this.disabled.set(false);
        }
      });

    // Update the default value
    this.formValue.set(this.formArray.getRawValue());
    this.syncPrimeNGFiles();
  }

  private createFileGroup(data: FormUploaderFile) {
    return this.fb.group({
      id: [data.id],
      file: [data.file],
    });
  }

  /**
   * Syncs the PrimeNG FileUpload component with the current form array value.
   *
   * This function is called when the component is initialized and when the form array value changes.
   *
   * It sets the `files` property of the PrimeNG FileUpload component to the current form array value,
   * where each value is a `File` object.
   */
  private syncPrimeNGFiles() {
    const uploader = this.uploader();
    if (!uploader) {
      return;
    }

    uploader.files = this.formValue().map(file => file.file);
  }

  /**
   * Called when the user selects files to upload.
   *
   * It will update the form array value with the new files.
   *
   * @param event - The PrimeNG FileSelectEvent containing the selected files.
   */
  private onPrimeFileSelect(event: FileSelectEvent) {
    console.log('[Form uploader] onPrimeFileSelect', event);
    // The files to be uploaded (all files)
    const fileArray = event.currentFiles;

    console.log('[Form uploader] onPrimeFileSelect - file array', fileArray);

    // Update the value
    this.formValue.update(existing => {
      const newValue = fileArray.map(file => {
        const existingFile = existing.find(f => f.file === file);
        return existingFile || { id: undefined, file };
      });

      console.log('Notifying Angular that the value has changed', newValue);

      // Notify Angular that the value has changed
      this.onTouchedFn();
      this.onChangeFn(newValue);

      return newValue;
    });
  }

  /**
   * Clears all files from the form array and resets the uploader state.
   *
   * This function is triggered when the user clears the selected files.
   * It sets the form array value to an empty array, effectively removing
   * all files, and notifies Angular of the change.
   */

  private onPrimeFileClear() {
    console.log('[Form uploader] onPrimeFileClear');
    // Clear the value
    this.formValue.set([]);

    // Notify Angular that the value has changed
    console.log('Notifying Angular that the value has changed', []);
    this.onChangeFn([]);
    this.onTouchedFn();
  }

  /**
   * Called when the user removes a file from the uploader.
   *
   * It will update the form array value by removing the file.
   *
   * @param event - The PrimeNG FileRemoveEvent containing the file to be removed.
   */
  private onPrimeFileRemove(event: FileRemoveEvent) {
    console.log('[Form uploader] onPrimeFileRemove', event);
    // The file to be removed
    const file = event.file;

    // Update the value
    this.formValue.update(existing => {
      const newValue = existing.filter(existingFile => existingFile.file !== file);
      console.log('Notifying Angular that the value has changed', newValue);

      // Notify Angular that the value has changed
      this.onTouchedFn();
      this.onChangeFn(newValue);

      return newValue;
    });
  }

  // #region Component events
  handleKeyDown(_event: KeyboardEvent) {
    this.onTouchedFn();
  }

  handleClick() {
    this.onTouchedFn();
  }
  // #endregion
}
