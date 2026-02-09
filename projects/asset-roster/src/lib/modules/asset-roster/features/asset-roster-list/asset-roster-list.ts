import { assetRosterFilters } from '../../libraries/asset-roster-filters';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { assetRosterColumns } from '../../libraries/asset-roster-columns';
import { assetRoster } from '../../interfaces/asset-roster';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FileResolver,
  FilterManager,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  tableColumn,
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
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AssetRosterImageDialog } from '../asset-roster-image-dialog/asset-roster-image-dialog';

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
    CardModule,
    TagModule,
    AssetRosterStatusSelect,
    AssetRosterFormDialog,
    HasPermission,
    ReportingDownloadDialog,
    TooltipModule,
    SelectButtonModule,
    AvatarModule,
    AssetRosterImageDialog,
  ],
  templateUrl: './asset-roster-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterList {
  private resourceManager = inject<ResourceManager<assetRoster>>(ResourceManager);
  private destroy$ = inject(DestroyRef);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private crudAssetRoster = inject(CrudAssetRoster);
  private fileResolver = inject(FileResolver);
  // Router
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  assetRosterColumns!: tableColumn<assetRoster>[];
  assetRosterFilters = assetRosterFilters;

  assetRosters = this.resourceManager.data;
  filtersForReporting = this.resourceManager.searchParams;

  //View
  isGrid = signal<boolean>(false);

  optionsView = [
    { label: 'List', value: false, icon: 'pi pi-table' },
    { label: 'Grid', value: true, icon: 'pi pi-th-large' },
  ];
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

  //Picture
  assetPictures = signal<Record<string, string>>({});
  @ViewChild('imageDialog') imageDialog!: AssetRosterImageDialog;

  //#endregion

  /**
   * Subscribe to the submitted form event from the create assetRosters form.
   * If the form was submitted successfully, reload the list of assetRosterss.
   */
  constructor() {
    this.assetRosterColumns = assetRosterColumns(this.assetPictures);

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

    effect(() => {
      const assets = this.assetRosters.value()?.docs;
      if (!assets) return;

      assets.forEach(async asset => {
        if (!asset.photo) return;

        if (this.assetPictures()[asset._id]) return;

        try {
          const blob = await this.fileResolver.resolveFile({
            id: asset.photo,
          });

          if (!blob) return;

          const url = URL.createObjectURL(blob);

          this.assetPictures.update(prev => ({
            ...prev,
            [asset._id]: url,
          }));
        } catch (error) {
          console.error('Error loading image', error);
        }
      });
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

  getPhoto(asset?: assetRoster): string {
    if (!asset?._id) {
      return 'https://st2.depositphotos.com/3904951/8925/v/450/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg';
    }
    return this.assetPictures()[asset._id];
  }
  goToEditAssetRoster = (element: assetRoster) => {
    this.router.navigate(['../maintenance/', element._id], { relativeTo: this.route });
  };
}
