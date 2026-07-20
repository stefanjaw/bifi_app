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
import { CrudVitalSignTypes } from '../../services/crud-vital-sign-types';
import { vitalSignTypeColumns } from '../../routes/vital-signs-columns';
import { vitalSignTypeFilters } from '../../routes/vital-signs-filters';
import { vitalSignType } from '../../interfaces/vital-signs';
import { VitalSignTypeFormDialog } from '../vital-sign-type-form-dialog/vital-sign-type-form-dialog';

/** List component for vital sign types */
@Component({
  selector: 'bifi-app-vital-sign-types-list',
  providers: [provideResourceManager(CrudVitalSignTypes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    VitalSignTypeFormDialog,
  ],
  templateUrl: './vital-sign-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VitalSignTypesList {
  private resourceManager = inject<ResourceManager<vitalSignType>>(ResourceManager);
  private crud = inject(CrudVitalSignTypes);
  private destroy$ = inject(DestroyRef);

  columns = vitalSignTypeColumns;
  filters = vitalSignTypeFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(VitalSignTypeFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: vitalSignType): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a vital sign type after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
