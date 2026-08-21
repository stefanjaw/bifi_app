import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { apiKey } from '@avalantec/base-app/interfaces';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DialogModule } from 'primeng/dialog';
import { ApiKeyForm, apiKeyFormModel } from '../../services/api-key-form';
import { ApiKeyCreateResponse, CrudApiKeys } from '../../services/crud-api-keys';
import dayjs from 'dayjs';

/**
 * Create/edit dialog for a self-service API key. On create the backend returns the
 * raw key exactly once; this dialog emits it via {@link created} so a parent can
 * open the reveal dialog (task 2.5). The key is never part of the form itself.
 */
@Component({
  selector: 'bifi-app-api-keys-form',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DatePickerModule,
    ToggleSwitchModule,
    FormModule,
    TranslatePipe,
  ],
  templateUrl: './api-keys-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeysForm extends BaseDialog {
  protected formService = inject(ApiKeyForm);
  private crud = inject(CrudApiKeys);
  private destroy$ = inject(DestroyRef);

  /** Optional existing key to edit; when absent the dialog is in create mode. */
  entity = input<apiKey | undefined>(undefined);

  /** Emits the created key (including the one-time raw `key`) for the reveal dialog. */
  created = output<ApiKeyCreateResponse>();

  form = this.formService.form;
  isSubmitLoading = signal<boolean>(false);
  isUpdate = computed(() => !!this.entity());

  /** Whether the form has unsaved changes (used by DirtyFormGuard when routed). */
  hasUnsavedChanges(): boolean {
    return this.formService.hasUnsavedChanges();
  }

  /** Resets form state and pre-fills existing values before opening the dialog. */
  override openDialog(): void {
    this.formService.reset();
    const existing = this.entity();
    if (existing) {
      this.formService.patchValue({
        name: existing.name,
        expires: !!existing.expiresAt,
        expiresAt: existing.expiresAt ?? '',
        active: existing.active,
      });
    } else {
      // Create mode: expires by default 30 days from now. (4.4)
      this.formService.patchValue({
        expires: true,
        expiresAt: dayjs().add(30, 'day').format('YYYY-MM-DD'),
      });
    }
    this.formService.resetDirtyState();
    super.openDialog();
  }

  /**
   * Submits the form: creates (surfacing the one-time key) or updates an existing
   * API key.
   * @param data - The submitted form value state.
   */
  async handleSubmit(data: FormValueState<apiKeyFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const payload: Record<string, unknown> = {
      name: rawValue.name,
      // `expires: false` tells the backend this key explicitly NEVER expires
      // (otherwise the server would default it to 30 days). Send the picker date
      // only when the "expires" toggle is on. (4.3 / never-expire fix)
      expires: rawValue.expires,
      ...(rawValue.expires && rawValue.expiresAt && {
        expiresAt: this.toIsoString(rawValue.expiresAt),
      }),
      active: rawValue.active,
    };

    if (this.isUpdate()) {
      this.crud
        .put({ _id: this.entity()?._id ?? '', data: payload })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitLoading.set(false);
            this.formService.reset();
            this.closeDialog();
          },
          error: () => {
            this.isSubmitLoading.set(false);
          },
        });
      return;
    }

    this.crud
      .post({ data: payload })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          this.isSubmitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          if (res?.key) this.created.emit(res);
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }

  /**
   * Normalizes an expiry value to an ISO-8601 date string before submission.
   * @param value - A Date or ISO string.
   * @returns The ISO-8601 representation.
   */
  private toIsoString(value: string | Date): string {
    return dayjs(value).toISOString();
  }
}
