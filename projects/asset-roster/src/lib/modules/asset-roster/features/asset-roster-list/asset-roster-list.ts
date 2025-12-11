import { assetRosterFilters } from '../../libraries/asset-roster-filters';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { assetRosterColumns } from '../../libraries/asset-roster-columns';
import { assetRoster } from '../../interfaces/asset-roster';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import {
  FilterManager,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudAssetRoster } from '../../services/crud-asset-rosters';
import { AssetRosterStatusCardComponent } from '../../ui/asset-roster-status-card/asset-roster-status-card';
import { AssetRosterFormDialog } from '../asset-roster-form-dialog/asset-roster-form-dialog';
import { AssetRosterMaintenanceContext } from '../../services/asset-roster-maintenance-context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AssetRosterStatusFilterManager } from '../../services/asset-roster-status-filter-manager';
import { HasPermission } from '@avalantec/base-app/auth';
import { ReportingDownloadDialog } from '@avalantec/base-app/reporting';
import { TagModule } from 'primeng/tag';
import { AssetRosterStatusSelect } from '../../ui/asset-roster-status-select/asset-roster-status-select';

@Component({
  selector: 'bifi-app-asset-roster-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  providers: [provideResourceManager(CrudAssetRoster)],
  imports: [
    RouterLink,
    AssetRosterStatusCardComponent,
    ButtonModule,
    SearchBar,
    TableLayout,
    TagModule,
    AssetRosterStatusSelect,
    AssetRosterFormDialog,
    HasPermission,
    ReportingDownloadDialog,
  ],
  templateUrl: './asset-roster-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterList {
  private resourceManager = inject<ResourceManager<assetRoster>>(ResourceManager);
  private destroy$ = inject(DestroyRef);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private crudAssetRoster = inject(CrudAssetRoster);

  assetRosterColumns = assetRosterColumns;
  assetRosterFilters = assetRosterFilters;

  assetRosters = this.resourceManager.data;
  filtersForReporting = this.resourceManager.searchParams;

  //#region Counting of asset roster by status
  private assetRosterStatusFilterManager = inject(AssetRosterStatusFilterManager);
  private filterManager = inject(FilterManager);

  // Queries
  private assetRostersUnderServiceQuery = signal(
    this.filterManager.getFilterObjectUtil([
      this.assetRosterStatusFilterManager.getFilterByStatus('under-service'),
    ])
  );
  private assetRostersInPMQuery = signal(
    this.filterManager.getFilterObjectUtil([
      this.assetRosterStatusFilterManager.getFilterByStatus('in-pm'),
    ])
  );
  private assetRosterOverdueQuery = signal(
    this.filterManager.getFilterObjectUtil([
      this.assetRosterStatusFilterManager.getFilterByOverdue(),
    ])
  );
  private assetRostersDueQuery = signal(
    this.filterManager.getFilterObjectUtil([this.assetRosterStatusFilterManager.getFilterByDue()])
  );

  private assetRostersPMNotSetQuery = signal(
    this.filterManager.getFilterObjectUtil([
      this.assetRosterStatusFilterManager.getFilterByPMNotSet(),
    ])
  );

  // Counts
  protected assetRostersUnderServiceCount = this.crudAssetRoster.getCount({
    searchParams: this.assetRostersUnderServiceQuery,
  });
  protected assetRostersOverdueCount = this.crudAssetRoster.getCount({
    searchParams: this.assetRosterOverdueQuery,
  });
  protected assetRostersDueCount = this.crudAssetRoster.getCount({
    searchParams: this.assetRostersDueQuery,
  });
  protected assetRostersInPMCount = this.crudAssetRoster.getCount({
    searchParams: this.assetRostersInPMQuery,
  });
  protected assetRostersPMNotSetCount = this.crudAssetRoster.getCount({
    searchParams: this.assetRostersPMNotSetQuery,
  });
  //#endregion

  /**
   * Subscribe to the submitted form event from the create assetRosters form.
   * If the form was submitted successfully, reload the list of assetRosterss.
   */
  constructor() {
    this.assetRosterMaintenanceContext.handleEvents$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(event => {
        if (event === 'saved') {
          this.assetRosters.reload();

          // reload counts
          this.assetRostersUnderServiceCount.reload();
          this.assetRostersOverdueCount.reload();
          this.assetRostersDueCount.reload();
          this.assetRostersInPMCount.reload();
          this.assetRostersPMNotSetCount.reload();
        }
      });
  }

  /**
   * Exports all assetRosters in CSV format.
   * @returns A Buffer containing the CSV data.
   */
  exportCSV() {
    this.crudAssetRoster.exportCSV();
  }

  importCSV(event: Event) {
    const target = event.target as HTMLInputElement;
    const csv = target.files?.[0];

    // reset file input
    target.value = '';

    this.crudAssetRoster
      .post({ data: { csv }, specificEndpoint: 'import' })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.assetRosters.reload();

          // reload counts
          this.assetRostersUnderServiceCount.reload();
          this.assetRostersOverdueCount.reload();
          this.assetRostersDueCount.reload();
          this.assetRostersInPMCount.reload();
          this.assetRostersPMNotSetCount.reload();
        },
      });
  }
}
