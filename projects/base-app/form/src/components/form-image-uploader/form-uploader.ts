import { ChangeDetectionStrategy, Component, contentChild, effect, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FormUploaderFile } from '@avalantec/base-app/form/src/components/form-image-uploader/form-uploader.model';
import { FileRemoveEvent, FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bifi-app-form-uploader',
  imports: [FileUpload],
  templateUrl: './form-uploader.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUploader implements ControlValueAccessor {
  // endpointUrl = input.required<string>();

  // PrimeNG FileUpload component
  uploader = contentChild(FileUpload);

  /** Angular ControlValueAccessor logic */
  onTouchedFn = () => {
    // Function to be called when the control is touched
  };

  onChangeFn = () => {
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

      this.syncPrimeNGFiles();

      const subscriptions: Subscription[] = [];

      subscriptions.push(uploader.onSelect.subscribe(event => this.onPrimeFileSelect(event)));
      subscriptions.push(uploader.onClear.subscribe(() => this.onPrimeFileClear()));
      subscriptions.push(uploader.onRemove.subscribe(event => this.onPrimeFileRemove(event)));

      onCleanup(() => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
      });
    });
  }

  private syncPrimeNGFiles() {
    const uploader = this.uploader();
    if (!uploader) {
      return;
    }

    uploader.files = this.formValue().map(file => file.file);
  }

  private onPrimeFileSelect(event: FileSelectEvent) {
    // The files to be uploaded (new ones)
    const files = event.files;

    // Update the value
    this.formValue.update(existing => [
      ...existing,
      ...files.map(file => ({ id: undefined, file })),
    ]);

    // Notify Angular that the value has changed
    this.onChangeFn();
    this.onTouchedFn();
  }

  private onPrimeFileClear() {
    // Clear the value
    this.formValue.set([]);

    // Notify Angular that the value has changed
    this.onChangeFn();
    this.onTouchedFn();
  }

  private onPrimeFileRemove(event: FileRemoveEvent) {
    // The file to be removed
    const file = event.file;

    // Update the value
    this.formValue.update(existing => existing.filter(existingFile => existingFile.file !== file));

    // Notify Angular that the value has changed
    this.onChangeFn();
    this.onTouchedFn();
  }

  // #region: ControlValueAccessor implementation
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(obj: any): void {
    this.formValue.set(obj);
    this.onChangeFn();
    this.syncPrimeNGFiles();
  }
  // #endregion

  // #region Component events
  handleKeyDown(_event: KeyboardEvent) {
    this.onTouchedFn();
  }

  handleClick() {
    this.onTouchedFn();
  }
  // #endregion
}
