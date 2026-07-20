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
import { CrudVitalSigns } from '../../services/crud-vital-signs';
import { vitalSignColumns } from '../../routes/vital-signs-columns';
import { vitalSignFilters } from '../../routes/vital-signs-filters';
import { vitalSign } from '../../interfaces/vital-signs';
import { VitalSignFormDialog } from '../vital-sign-form-dialog/vital-sign-form-dialog';

/** List component for vital signs */
@Component({
  selector: 'bifi-app-vital-signs-list',
  providers: [provideResourceManager(CrudVitalSigns)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    VitalSignFormDialog,
  ],
  templateUrl: './vital-signs-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VitalSignsList {
  private resourceManager = inject<ResourceManager<vitalSign>>(ResourceManager);
  private crud = inject(CrudVitalSigns);
  private destroy$ = inject(DestroyRef);

  columns = vitalSignColumns;
  filters = vitalSignFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(VitalSignFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: vitalSign): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a vital sign record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
