import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { apiKey } from '@avalantec/base-app/interfaces';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { apiKeyColumns } from '../../libraries/api-key-columns';
import { apiKeyFilters } from '../../libraries/api-key-filters';
import { ApiKeyCreateResponse, CrudApiKeys } from '../../services/crud-api-keys';
import { ApiKeyRevealDialog } from '../api-key-reveal-dialog/api-key-reveal-dialog';
import { ApiKeysForm } from '../api-keys-form/api-keys-form';

/**
 * Self-service API keys list. Creation is a dialog (not a route): the "Add"
 * button opens {@link ApiKeysForm}, and on creation the resulting one-time key is
 * surfaced through {@link ApiKeyRevealDialog}. There is no edit action — keys can
 * only be created or revoked.
 */
@Component({
  selector: 'bifi-app-api-keys-list',
  providers: [provideResourceManager(CrudApiKeys)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    ApiKeysForm,
    ApiKeyRevealDialog,
  ],
  templateUrl: './api-keys-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeysList {
  private resourceManager = inject<ResourceManager<apiKey>>(ResourceManager);
  private crud = inject(CrudApiKeys);
  private destroy$ = inject(DestroyRef);

  columns = apiKeyColumns;
  filters = apiKeyFilters;
  data = this.resourceManager.data;

  /** The one-time raw key awaiting reveal after creation. */
  pendingKey = signal<string>('');

  private createDialog = viewChild(ApiKeysForm);
  private revealDialog = viewChild(ApiKeyRevealDialog);

  /** Opens the create dialog. */
  openCreateDialog() {
    this.createDialog()?.openDialog();
  }

  /**
   * Handles a successful creation: stores the one-time key, opens the reveal
   * dialog, and refreshes the list.
   * @param created - The created key including the one-time raw `key`.
   */
  onCreated(created: ApiKeyCreateResponse) {
    this.pendingKey.set(created.key);
    this.revealDialog()?.openDialog();
    this.data.reload();
  }

  /**
   * Revokes (deletes) an API key.
   * @param id - The API key record id to revoke.
   */
  revoke(id: string) {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.data.reload();
        },
      });
  }
}
