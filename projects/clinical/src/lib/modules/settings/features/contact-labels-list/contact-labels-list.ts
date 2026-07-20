import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
import {
  TableLayout,
  SearchBar,
  ButtonsActions,
  ResourceManager,
  provideResourceManager,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudContactLabels } from '../../services/crud-contact-labels';
import { contactLabelColumns } from '../../routes/settings-columns';
import { contactLabelFilters } from '../../routes/settings-filters';
import { contactLabel } from '../../interfaces/settings';
import { ContactLabelFormDialog } from '../contact-label-form-dialog/contact-label-form-dialog';

/** List component for contact labels */
@Component({
  selector: 'bifi-app-contact-labels-list',
  providers: [provideResourceManager(CrudContactLabels)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    ContactLabelFormDialog,
  ],
  templateUrl: './contact-labels-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLabelsList {
  private resourceManager = inject<ResourceManager<contactLabel>>(ResourceManager);
  private crud = inject(CrudContactLabels);
  private destroy$ = inject(DestroyRef);

  columns = contactLabelColumns;
  filters = contactLabelFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(ContactLabelFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: contactLabel): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a contact label record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
