import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { CrudFacilities } from '../../services/crud-facilities';
import { facility } from '../../interfaces/facility';
import { facilityColumns } from '../../libraries/facility-columns';
import { facilityFilters } from '../../libraries/facility-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-facilities-list',
  providers: [provideResourceManager(CrudFacilities)],
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './facilities-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilitiesList {
  private resourceManager = inject<ResourceManager<facility>>(ResourceManager);
  private crudFacilities = inject(CrudFacilities);
  private destroy$ = inject(DestroyRef);

  facilityColumns = facilityColumns;
  facilityFilters = facilityFilters;

  facilities = this.resourceManager.data;

  //Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  gotoEditFacility = (element: facility) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
  deleteFacility(id: string) {
    this.crudFacilities
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.facilities.reload();
        },
      });
  }
}
