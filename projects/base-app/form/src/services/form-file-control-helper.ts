import { computed, DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ControlsOf } from '../interfaces/typed-form-builder';
import { FormUploaderFile } from '../interfaces/form-uploader-image';
import { distinctUntilChanged, filter } from 'rxjs';
import { FormFileMetadata } from '../interfaces/form-file';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FormFileControlHelper {
  /**
   * Returns a signal containing the metadata of the files in the given form array control.
   * The metadata includes the id, file, and url of each file.
   * The url is a blob url that can be used to display the file in an image tag.
   * The url is revoked when the file is removed from the control or the component is destroyed.
   * The function also returns two additional signals, firstFile and lastFile, which are the first and last files of the control, respectively.
   * @param control The form array control.
   * @param injector The injector to use. Defaults to the injector of the component that this service is injected into.
   * @returns An object containing the fileList signal, the firstFile signal, and the lastFile signal.
   */
  generateMetadataFromFileControl(
    control: FormArray<FormGroup<ControlsOf<FormUploaderFile>>>,
    injector = inject(Injector)
  ) {
    const fileList = signal<FormFileMetadata[]>([]);
    const firstFile = computed(() => (fileList().length > 0 ? fileList()[0] : null));
    const lastFile = computed(() =>
      fileList().length > 0 ? fileList()[fileList().length - 1] : null
    );

    const destroy$ = injector.get(DestroyRef);

    /**
     * This function is a bit complex, so here is a step by step explanation:
     * 1. It takes a form array control and returns an object with three signals:
     *    - fileList: a signal that contains the metadata of all the files in the control.
     *    - firstFile: a computed signal that contains the first file of the control.
     *    - lastFile: a computed signal that contains the last file of the control.
     * 2. It is important to note that the url of the files is a blob url that is revoked when the file is removed from the control or the component is destroyed.
     * 3. It uses the valueChanges event of the control to generate the metadata.
     * 4. It uses the distinctUntilChanged operator to make sure that the metadata is only generated when the value of the control changes.
     * 5. It uses the takeUntilDestroyed operator to make sure that the subscription to the valueChanges event is revoked when the component is destroyed.
     * 6. It uses the filter operator to make sure that the subscription to the valueChanges event is only active when the control contains controls.
     */
    control.valueChanges
      .pipe(
        takeUntilDestroyed(destroy$),
        filter(() => !!control.controls.length), // Only proceed if the array contains controls
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(() => {
        const prev = fileList();
        const raw = control.getRawValue();

        const newList: FormFileMetadata[] = raw.map((data, index) => {
          const prevItem = prev[index];
          const isSameFile = prevItem && prevItem.file === data.file;

          return {
            id: data.id,
            file: data.file,
            url: isSameFile
              ? prevItem!.url
              : data.file !== null
                ? URL.createObjectURL(data.file)
                : '',
          };
        });

        // Revoke the URLs of the previous files that no longer exist or have changed
        prev.forEach((item, index) => {
          if (!newList[index] || newList[index].url !== item.url) {
            URL.revokeObjectURL(item.url);
          }
        });

        fileList.set(newList);
      });

    return { fileList, firstFile, lastFile };
  }
}
