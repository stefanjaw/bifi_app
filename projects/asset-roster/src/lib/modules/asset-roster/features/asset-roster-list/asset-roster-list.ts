import { assetRosterFilters } from '../../libraries/asset-roster-filters';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { assetRosterColumns } from '../../libraries/asset-roster-columns';
import { assetRoster } from '../../interfaces/asset-roster';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FileResolver,
  FilterManager,
  InfiniteScroll,
  PaginationManager,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  tableColumn,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudAssetRoster } from '../../services/crud-asset-rosters';
import { AssetRosterStatusCard } from '../../ui/asset-roster-status-card/asset-roster-status-card';
import { AssetRosterFormDialog } from '../asset-roster-form-dialog/asset-roster-form-dialog';
import { AssetRosterImportPreviewDialog } from '../asset-roster-import-preview-dialog/asset-roster-import-preview-dialog';
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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { t, TranslatePipe } from '@avalantec/base-app/i18n';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'bifi-app-asset-roster-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4', style: 'overflow-anchor: none' },
  providers: [provideResourceManager(CrudAssetRoster), ConfirmationService],
  imports: [
    RouterLink,
    AssetRosterStatusCard,
    ButtonModule,
    SearchBar,
    TableLayout,
    CardModule,
    TagModule,
    AssetRosterStatusSelect,
    AssetRosterFormDialog,
    AssetRosterImportPreviewDialog,
    HasPermission,
    ReportingDownloadDialog,
    TooltipModule,
    SelectButtonModule,
    AvatarModule,
    InfiniteScroll,
    ConfirmDialogModule,
    TranslatePipe,
  ],
  templateUrl: './asset-roster-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetRosterList {
  private resourceManager = inject<ResourceManager<assetRoster>>(ResourceManager);
  private paginationManager = inject(PaginationManager);
  private destroy$ = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);
  private crudAssetRoster = inject(CrudAssetRoster);
  private fileResolver = inject(FileResolver);
  private importPreviewDialog = viewChild.required(AssetRosterImportPreviewDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  assetRosterColumns!: tableColumn<assetRoster>[];
  assetRosterFilters = assetRosterFilters;

  assetRosters = this.resourceManager.data;
  filtersForReporting = this.resourceManager.searchParams;

  //View
  isGrid = signal<boolean>(false);

  // List-view selection is shared by the Export, Archive, and Unarchive actions.
  selectionMode = signal(false);
  selectedAssetRosterIds = signal<string[]>([]);
  archivingSelected = signal(false);
  unarchivingSelected = signal(false);

  // ResourceManager uses true to request active: false records.
  showingArchivedRecords = computed(() => this.resourceManager.getInactiveStatus() === true);

  // Scroll detection

  isScrolled = signal(false);

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

    afterNextRender(() => {
      const container = document.getElementById('bifi-app-scaffold-outlet');
      if (!container) return;

      const handleScroll = () => {
        const y = container.scrollTop;
        if (y > 50 && !this.isScrolled()) {
          this.isScrolled.set(true);
        } else if (y < 10 && this.isScrolled()) {
          this.isScrolled.set(false);
        }
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      this.destroy$.onDestroy(() => container.removeEventListener('scroll', handleScroll));
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
   */
  exportCSV(): void {
    this.crudAssetRoster.exportCSV();
  }

  /**
   * Toggles between the active Asset Roster and the archived Asset Roster.
   */
  toggleArchivedRecords(): void {
    const showArchived = !this.showingArchivedRecords();

    this.exitSelectionMode();
    this.paginationManager.resetPaginationOptions();
    this.resourceManager.getInactiveStatus.set(showArchived);
  }

  /**
   * Enables or exits List-view selection mode.
   */
  toggleSelectionMode(): void {
    this.selectionMode.update(enabled => !enabled);
    this.selectedAssetRosterIds.set([]);
  }

  /**
   * Leaves selection mode and clears the current selection.
   */
  private exitSelectionMode(): void {
    this.selectionMode.set(false);
    this.selectedAssetRosterIds.set([]);
  }

  /**
   * Clears selection mode when users change to Grid view, because checkboxes
   * are implemented only for the table/list view in this first release.
   */
  setView(isGrid: boolean): void {
    this.isGrid.set(isGrid);

    // Bulk actions are available only in the List view.
    if (isGrid) {
      this.exitSelectionMode();
    }
  }

  /**
   * Downloads a CSV containing only the selected Asset Roster records.
   */
  exportSelectedCSV(): void {
    const ids = this.selectedAssetRosterIds();

    if (ids.length === 0) return;

    this.crudAssetRoster.exportSelectedCSV(ids);
  }

  /**
   * Opens the CSV import preview dialog with the selected file.
   * @param event - The file input change event.
   */
  openImportPreview(event: Event): void {
    const target = event.target as HTMLInputElement;
    const csv = target.files?.[0];

    // Allow selecting the same file again after closing the dialog.
    target.value = '';

    if (csv) {
      this.importPreviewDialog().open(csv);
    }
  }

  /**
   * Soft-archives the selected records after confirmation.
   */
  archiveSelected(): void {
    const ids = this.selectedAssetRosterIds();

    if (ids.length === 0 || this.archivingSelected()) {
      return;
    }

    this.confirmationService.confirm({
      header: t('archiveSelectedConfirmTitle', {}, 'asset-roster'),
      message: t('archiveSelectedConfirmMessage', { count: ids.length }, 'asset-roster'),
      accept: () => this.doArchiveSelected(ids),
    });
  }

  /**
   * Executes the archive request for the confirmed record ids.
   * @param ids - The record ids to archive.
   */
  private doArchiveSelected(ids: string[]): void {
    this.archivingSelected.set(true);

    this.crudAssetRoster
      .archiveSelected(ids)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.archivingSelected.set(false);
          this.exitSelectionMode();
          this.reloadAfterImport();
        },
        error: () => {
          this.archivingSelected.set(false);
        },
      });
  }

  /**
   * Restores the selected archived records after confirmation.
   */
  unarchiveSelected(): void {
    const ids = this.selectedAssetRosterIds();

    if (ids.length === 0 || this.unarchivingSelected()) {
      return;
    }

    this.confirmationService.confirm({
      header: t('unarchiveSelectedConfirmTitle', {}, 'asset-roster'),
      message: t('unarchiveSelectedConfirmMessage', { count: ids.length }, 'asset-roster'),
      accept: () => this.doUnarchiveSelected(ids),
    });
  }

  /**
   * Executes the unarchive request for the confirmed record ids.
   * @param ids - The record ids to restore.
   */
  private doUnarchiveSelected(ids: string[]): void {
    this.unarchivingSelected.set(true);

    this.crudAssetRoster
      .unarchiveSelected(ids)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.unarchivingSelected.set(false);
          this.exitSelectionMode();
          this.reloadAfterImport();
        },
        error: () => {
          this.unarchivingSelected.set(false);
        },
      });
  }

  /** Reloads the list and every status-count query after a data mutation. */
  reloadAfterImport(): void {
    this.assetRosters.reload();
    this.assetRostersUnderServiceCount.reload();
    this.assetRostersOverdueCount.reload();
    this.assetRostersDueCount.reload();
    this.assetRostersInPMCount.reload();
    this.assetRostersPMNotSetCount.reload();
  }

  /**
   * Returns the URL of the photo associated with the given assetRoster.
   * If no assetRoster is provided, returns a default image URL.
   * @param asset The assetRoster to retrieve the photo URL from.
   * @returns The URL of the photo associated with the given assetRoster.
   */
  getPhoto(asset?: assetRoster): string {
    if (!asset?._id) {
      return 'https://st2.depositphotos.com/3904951/8925/v/450/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg';
    }
    return this.assetPictures()[asset._id];
  }

  /**
   * Navigates to the asset roster maintenance page for the given asset.
   * @param asset The asset to navigate to its maintenance page.
   */
  goToEditAssetRoster = (asset: assetRoster) => {
    this.router.navigate(['../maintenance', asset._id], {
      relativeTo: this.route,
    });
  };
}
