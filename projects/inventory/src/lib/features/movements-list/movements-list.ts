import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  ButtonsConfirmationDialog,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudMovements } from '../../services/crud-movements';
import { stockMovement } from '../../interfaces/stock-movement';
import { movementColumns } from '../../libraries/movement-columns';
import { movementFilters } from '../../libraries/movement-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-movements-list',
  providers: [provideResourceManager(CrudMovements)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    TooltipModule,
    ToastModule,
    ButtonsConfirmationDialog,
    HasPermission,
    TranslatePipe,
  ],
  templateUrl: './movements-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementsList {
  private resourceManager = inject<ResourceManager<stockMovement>>(ResourceManager);
  private crudMovements = inject(CrudMovements);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);
  private destroy$ = inject(DestroyRef);

  movementColumns = movementColumns;
  movementFilters = movementFilters;
  entries = this.resourceManager.data;

  private reversalDialog = viewChild.required(ButtonsConfirmationDialog);

  /** ID of the movement pending reversal confirmation; empty when no dialog is open */
  pendingReverseId = signal<string>('');
  isReversing = signal(false);

  /**
   * Opens the reversal confirmation dialog for the given movement.
   * @param element - The movement row to reverse.
   */
  openReverseDialog(element: stockMovement) {
    this.pendingReverseId.set(element._id);
    this.reversalDialog().openDialog();
  }

  /**
   * Reverses the pending movement after confirmation, creating an opposing
   * linked movement, then refreshes the list.
   */
  reverseMovement() {
    const movementId = this.pendingReverseId();
    if (!movementId) {
      return;
    }
    this.isReversing.set(true);
    this.crudMovements
      .reverse(movementId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isReversing.set(false);
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('reverse', {}, 'inventory'),
            detail: this.translationService.translate('movementReversed', {}, 'inventory'),
          });
          this.entries.reload();
        },
        error: () => {
          this.isReversing.set(false);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('reverse', {}, 'inventory'),
            detail: this.translationService.translate('movementReverseError', {}, 'inventory'),
          });
        },
      });
  }
}
