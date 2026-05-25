import {
  Component,
  computed,
  effect,
  inject,
  DestroyRef,
  signal,
  viewChild,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { CrudAssetRoster } from '../../services/crud-asset-rosters';
import { UpdateAssetRosterForm } from '../../services/update-asset-roster-form';
import { AssetRosterEditForm } from '../../ui/asset-roster-edit-form/asset-roster-edit-form';
import { assetRoster } from '../../interfaces/asset-roster';
import { CrudAssetType } from '../../../asset-types';
import { CrudRooms } from '../../../facilities';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudMaintenanceWindows } from '../../../maintenance-windows';
import { ToastManager } from '@avalantec/base-app/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import {
  AssetCommissioningFormDialog,
  assetCommissionning,
  AssetDecommissioningFormDialog,
} from '../../../asset-commissioning';
import { AssetRosterMaintenanceContext } from '../../services/asset-roster-maintenance-context';
import {
  CrudAssetMaintenances,
  AssetFinishMaintenanceFormDialog,
  assetMaintenance,
  AssetMaintenanceFormDialog,
  AssetSkipMaintenanceFormDialog,
} from '../../../asset-maintenances';
import {
  activityHistory,
  CrudActivityHistories,
  FileResolver,
  FilterManager,
  orderByQuery,
} from '@avalantec/base-app/resource';
import { AssetRosterAddDocumentFormDialog } from '../asset-roster-document-dialog/asset-roster-document-dialog';
import { addDocumentFormModel } from '../../services/add-document-form';
import { AssetRosterImageDialog } from '../asset-roster-image-dialog/asset-roster-image-dialog';

@Component({
  selector: 'bifi-app-asset-roster-maintenance',
  imports: [
    AssetRosterEditForm,
    AssetCommissioningFormDialog,
    AssetDecommissioningFormDialog,
    AssetMaintenanceFormDialog,
    AssetFinishMaintenanceFormDialog,
    AssetRosterAddDocumentFormDialog,
    AssetSkipMaintenanceFormDialog,
    AssetRosterImageDialog,
  ],
  templateUrl: './asset-roster-maintenance.html',
})
export class AssetRosterMaintenance {
  private formService = inject(UpdateAssetRosterForm);
  private crudAssetRoster = inject(CrudAssetRoster);
  private assetTypesService = inject(CrudAssetType);
  private contactsService = inject(CrudContacts);
  private roomsService = inject(CrudRooms);
  private maintenaceWindowsService = inject(CrudMaintenanceWindows);
  private crudAssetMaintenances = inject(CrudAssetMaintenances);
  private crudActivityHistories = inject(CrudActivityHistories);
  private router = inject(Router);
  private toastManager = inject(ToastManager);
  private destroy$ = inject(DestroyRef);
  private fileResolverService = inject(FileResolver);
  private filterManager = inject(FilterManager);
  private assetRosterMaintenanceContext = inject(AssetRosterMaintenanceContext);

  // Coming in route as param
  id = input.required<string>();

  assetRosterResource = this.crudAssetRoster.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  // Data
  assetTypes = this.assetTypesService.get({});
  contacts = this.contactsService.get({});
  rooms = this.roomsService.get({});
  maintenanceWindows = this.maintenaceWindowsService.get({});

  // Full active asset roster list — used to power prev/next header navigation
  // and the "X of Y" counter. Uses the default list ordering.
  allAssetRosters = this.crudAssetRoster.get({});

  // Histories
  private activityHistoryQuery = computed(() => {
    return this.filterManager.getFilterObjectUtil([
      {
        operator: 'or',
        filters: [
          {
            operator: 'and',
            filters: [
              { field: 'model', operator: '==', value: 'AssetRoster' },
              { field: 'modelId', operator: '==', value: this.id() },
            ],
          },
          {
            operator: 'and',
            filters: [{ field: 'metadata.assetRosterId', operator: '==', value: this.id() }],
          },
        ],
      },
    ]);
  });

  private activityHistoryOrder = signal<orderByQuery<activityHistory>>([
    { field: 'performDate', order: 'desc' },
  ]);

  activityHistories = this.crudActivityHistories.get<
    activityHistory<assetCommissionning | assetMaintenance>
  >({
    searchParams: this.activityHistoryQuery,
    sort: this.activityHistoryOrder,
    getInactive: null,
  });

  // state
  loading = computed(() => {
    return (
      this.assetRosterResource.isLoading() ||
      this.assetTypes.isLoading() ||
      this.contacts.isLoading() ||
      this.rooms.isLoading() ||
      this.maintenanceWindows.isLoading() ||
      this.activityHistories.isLoading()
    );
  });

  submitLoading = signal(false);

  // get first assetRoster and store it
  assetRoster = this.assetRosterResource.value;

  // State — edit mode is enabled by default; the wrapper used to flip this
  // back and forth via an "Edit Details" button, but every field is now
  // editable on arrival. The Save / Cancel buttons in the header are gated
  // on `isDirty` instead of on this flag.
  isEditMode = signal(true);

  // Reactive dirty-state of the form — drives the visibility of the
  // header's Cancel + Save Changes buttons. We listen to `form.events`
  // (Angular 18+) so the signal updates on every value change AND every
  // pristine/dirty change — including the `markAsPristine()` called by
  // `resetValueToInitialState()` on save/cancel/reload, which would not
  // emit a value change.
  isDirty = toSignal(
    this.formService.form.events.pipe(
      startWith(null),
      map(() => this.formService.form.dirty)
    ),
    { initialValue: this.formService.form.dirty }
  );

  // Header navigation — derive the current asset's index in the full list
  // and expose prev/next ids and a total count for the X-of-Y counter.
  currentIndex = computed(() => {
    const list = this.allAssetRosters.value() ?? [];
    const id = this.assetRoster()?._id;
    if (!id || list.length === 0) return -1;
    return list.findIndex(a => a._id === id);
  });

  totalAssets = computed(() => (this.allAssetRosters.value() ?? []).length);

  prevAssetId = computed<string | null>(() => {
    const list = this.allAssetRosters.value() ?? [];
    const idx = this.currentIndex();
    return idx > 0 ? (list[idx - 1]._id ?? null) : null;
  });

  nextAssetId = computed<string | null>(() => {
    const list = this.allAssetRosters.value() ?? [];
    const idx = this.currentIndex();
    return idx >= 0 && idx < list.length - 1 ? (list[idx + 1]._id ?? null) : null;
  });

  // children
  commissioningInitFormDialog = viewChild<AssetCommissioningFormDialog>(
    AssetCommissioningFormDialog
  );
  decommissioningFormDialog = viewChild<AssetDecommissioningFormDialog>(
    AssetDecommissioningFormDialog
  );
  serviceFormDialog = viewChild<AssetMaintenanceFormDialog>(AssetMaintenanceFormDialog);
  finishServiceDialog = viewChild<AssetFinishMaintenanceFormDialog>('finishService');
  finishPMDialog = viewChild<AssetFinishMaintenanceFormDialog>('finishPM');
  documentDialog = viewChild<AssetRosterAddDocumentFormDialog>(AssetRosterAddDocumentFormDialog);
  skipPMDialog = viewChild<AssetSkipMaintenanceFormDialog>(AssetSkipMaintenanceFormDialog);
  imageDialog = viewChild<AssetRosterImageDialog>(AssetRosterImageDialog);

  constructor() {
    effect(() => {
      const assetRoster = this.assetRoster();

      // set new values as initial state
      this.resetValueToInitialState(assetRoster);
    });

    this.handleEvents();
  }

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
  }

  handleOpenPhotoDialog() {
    this.imageDialog()?.openDialog();
  }

  handleNavigatePrevAsset() {
    const id = this.prevAssetId();
    if (!id) return;
    if (!this.confirmDiscardUnsavedChanges()) return;
    this.router.navigate(['asset-roster', 'equipment', 'maintenance', id]);
  }

  handleNavigateNextAsset() {
    const id = this.nextAssetId();
    if (!id) return;
    if (!this.confirmDiscardUnsavedChanges()) return;
    this.router.navigate(['asset-roster', 'equipment', 'maintenance', id]);
  }

  handleSave() {
    const { dirtyValue: value } = this.formService.getValueState();

    this.submitLoading.set(true);

    const assetRosterRequest = this.crudAssetRoster.put({
      _id: this.assetRoster()?._id || '',
      fileFields: ['photo'],
      data: {
        ...value,
        ...(value.locationAssignments !== undefined && {
          locationAssignments: value.locationAssignments.filter(
            (la: any) => la?.locationId && la?.assignedQuantity > 0
          ),
        }),
        ...(value.assetTypeIds && {
          assetTypeIds: [value.assetTypeIds],
        }),
        ...(value.makeIds && {
          makeIds: [value.makeIds],
        }),
        ...(value.vendorIds && {
          vendorIds: [value.vendorIds],
        }),
        ...(value.maintenanceWindowIds && {
          maintenanceWindowIds: [value.maintenanceWindowIds],
        }),
        ...(value.acquiredDate && {
          acquiredDate: value.acquiredDate.toISOString(),
        }),
        ...(value.warrantyDate && {
          warrantyDate: value.warrantyDate.toISOString(),
        }),
        ...(value.maintenanceDate && {
          maintenanceDate: value.maintenanceDate.toISOString(),
        }),
        ...(value.commissionedDate && {
          commissionedDate: value.commissionedDate.toISOString(),
        }),
      },
    });

    assetRosterRequest.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        // Edit mode stays on (edit-by-default); resetValueToInitialState
        // marks the form pristine via the asset reload effect, which hides
        // the Save / Cancel buttons.
        this.assetRosterMaintenanceContext.handleSaved();
        this.handleReloadAssetRoster();
        this.toastManager.showSuccess('Asset updated successfully');
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  }

  handleCancel() {
    // Revert all edits and mark pristine; edit mode stays on.
    this.resetValueToInitialState(this.assetRoster());
  }

  handleOpencommissionDialog() {
    this.commissioningInitFormDialog()?.openDialog();
  }

  handleOpenDecommissionDialog() {
    this.decommissioningFormDialog()?.openDialog();
  }

  handleOpenServiceDialog() {
    this.serviceFormDialog()?.openDialog();
  }

  handleOpenFinishServiceDialog() {
    this.finishServiceDialog()?.openDialog();
  }

  handleOpenFinishPMDialog() {
    this.finishPMDialog()?.openDialog();
  }

  handleOpenSkipPMDialog() {
    this.skipPMDialog()?.openDialog();
  }

  handleAddDocument() {
    this.documentDialog()?.openDialog();
  }

  handleDocumentAdded(data: addDocumentFormModel) {
    const attachmentsControl = this.formService.form.controls.attachments;
    const metadatasControl = this.formService.form.controls.attachmentsMetadata;

    //  Add the uploaded file to the attachments array
    attachmentsControl.pushItem(data.files[0]);

    // Add the descriptor to the descriptor array
    metadatasControl.pushItem({
      descriptor: data.descriptor,
    });
  }

  handleInitiatePM() {
    this.crudAssetMaintenances
      .post({
        data: {
          assetRosterId: this.assetRoster()?._id || '',
          name: 'PM',
          dateStart: new Date().toISOString(),
          type: 'preventive-maintenance',
          // manual: isPMOutOfRange ? 'true' : 'false',
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.handleReloadAssetRoster();
          this.toastManager.showSuccess('PM initiated successfully');
        },
      });
  }

  handleBackToDashboard() {
    if (!this.confirmDiscardUnsavedChanges()) return;
    this.router.navigate(['asset-roster', 'equipment', 'list']);
  }

  /**
   * Returns true when navigation away from the current asset should proceed.
   * Blocks while a save is in flight (the asset reload + toast would land on
   * the new asset and confuse the user). Otherwise prompts the user to
   * confirm discarding any unsaved edits.
   */
  private confirmDiscardUnsavedChanges(): boolean {
    if (this.submitLoading()) {
      this.toastManager.showInfo('Please wait — your changes are still being saved.');
      return false;
    }
    if (!this.formService.form.dirty) return true;
    return window.confirm(
      'You have unsaved changes on this asset. Leaving will discard them. Continue?'
    );
  }

  handleReloadAssetRoster() {
    this.assetRosterResource.reload();
    this.activityHistories.reload();
  }

  handleExportActivityHistory() {
    this.crudActivityHistories.exportCSV(this.assetRoster()?._id);
  }

  /**
   * Resets the form values to their initial state, based on the provided asset roster.
   * If the asset roster is not provided, the form values will be reset to their default state.
   * @param assetRoster The asset roster to reset the form values to, or undefined to reset to the default state.
   */
  private async resetValueToInitialState(assetRoster: assetRoster | undefined) {
    if (!assetRoster) {
      this.formService.reset();
      return;
    }

    const parsedImage = assetRoster.photo
      ? await this.fileResolverService.resolveFile({
          id: assetRoster.photo,
        })
      : null;

    const parsedDocuments = await Promise.all(
      assetRoster.attachments?.map(async file => ({
        id: file.fileId,
        file: (await this.fileResolverService.resolveFile({ metadata: file }))!,
      })) || []
    );

    const parsedMetadata = assetRoster.attachments?.map(doc => ({
      descriptor: (doc.fileMetadata?.['descriptor'] as string) || '',
    }));

    const locationAssignmentsArray = this.formService.form.controls.locationAssignments;
    locationAssignmentsArray.clear();
    if (assetRoster.locationAssignments?.length) {
      assetRoster.locationAssignments.forEach(la => {
        locationAssignmentsArray.pushItem({
          locationId: (la.locationId as any)?._id ?? la.locationId ?? '',
          assignedQuantity: la.assignedQuantity ?? 0,
        });
      });
    }

    this.formService.patchValue({
      deviceType: assetRoster.deviceType ?? 'serialized',
      description: assetRoster.description ?? null,
      quantity: assetRoster.quantity ?? null,
      softwareConfiguration: {
        regulatoryClassification:
          assetRoster.softwareConfiguration?.regulatoryClassification ?? null,
        version: assetRoster.softwareConfiguration?.version ?? null,
        parentAssetId: assetRoster.softwareConfiguration?.parentAssetId ?? null,
        udiDi: assetRoster.softwareConfiguration?.udiDi ?? null,
        fdaMdrClass: assetRoster.softwareConfiguration?.fdaMdrClass ?? null,
        licenseType: assetRoster.softwareConfiguration?.licenseType ?? null,
        licenseKey: assetRoster.softwareConfiguration?.licenseKey ?? null,
        preventAutoUpdate: assetRoster.softwareConfiguration?.preventAutoUpdate ?? false,
      },
      condition: assetRoster.condition,
      currentPrice: assetRoster.currentPrice,
      acquiredDate: assetRoster.acquiredDate ? new Date(assetRoster.acquiredDate) : null,
      locationId: assetRoster.locationId?._id || '',
      productModel: assetRoster.productModel,
      acquiredPrice: assetRoster.acquiredPrice,
      maintenanceWindowIds: assetRoster.maintenanceWindowIds?.[0]?._id || '',
      maintenanceDate: assetRoster.maintenanceDate ? new Date(assetRoster.maintenanceDate) : null,
      makeIds: assetRoster.makeIds?.[0]?._id || '',
      vendorIds: assetRoster.vendorIds?.[0]?._id || '',
      serialNumber: assetRoster.serialNumber,
      assetTypeIds: assetRoster.assetTypeIds?.[0]?._id || '',
      remarks: assetRoster.remarks?.map(note => ({
        remark: note.remark,
        createdBy: note.createdBy?._id ?? note.createdBy,
        performDate: new Date(note.performDate),
      })),
      warrantyDate: assetRoster.warrantyDate ? new Date(assetRoster.warrantyDate) : null,
      commissionedDate: assetRoster.commissionedDate
        ? new Date(assetRoster.commissionedDate)
        : null,
      estimatedEconomicLifeYears: assetRoster.estimatedEconomicLifeYears ?? null,
      salvageValue: assetRoster.salvageValue ?? null,
      depreciationMethod: assetRoster.depreciationMethod ?? 'straight-line',
      accelerationFactor: assetRoster.accelerationFactor ?? 200,
      ...((parsedImage && {
        photo: [
          {
            id: assetRoster.photo,
            file: parsedImage,
          },
        ],
      }) || {
        photo: [],
      }),
      attachments: parsedDocuments,
      attachmentsMetadata: parsedMetadata,
    });

    this.formService.form.markAsPristine();
    this.formService.form.markAsUntouched();
  }

  private handleEvents() {
    this.assetRosterMaintenanceContext.handleEvents$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(event => {
        switch (event) {
          case 'toggle-edit':
            this.toggleEditMode();
            break;
          case 'save':
            this.handleSave();
            break;
          case 'cancel':
            this.handleCancel();
            break;
          case 'open-commission-dialog':
            this.handleOpencommissionDialog();
            break;
          case 'open-decommission-dialog':
            this.handleOpenDecommissionDialog();
            break;
          case 'open-service-dialog':
            this.handleOpenServiceDialog();
            break;
          case 'open-finish-service-dialog':
            this.handleOpenFinishServiceDialog();
            break;
          case 'add-document':
            this.handleAddDocument();
            break;
          case 'open-finish-pm-dialog':
            this.handleOpenFinishPMDialog();
            break;
          case 'init-pm':
            this.handleInitiatePM();
            break;
          case 'open-skip-pm':
            this.handleOpenSkipPMDialog();
            break;
          case 'back-to-dashboard':
            this.handleBackToDashboard();
            break;
          case 'commission':
          case 'decommission':
          case 'service':
          case 'finish-service':
          case 'finish-pm':
          case 'skip-pm':
            this.handleReloadAssetRoster();
            break;
          case 'activity-history-add-file':
            this.activityHistories.reload();
            break;
          case 'export-activity-history':
            this.handleExportActivityHistory();
            break;
          case 'open-photo-dialog':
            this.handleOpenPhotoDialog();
            break;
          case 'navigate-prev-asset':
            this.handleNavigatePrevAsset();
            break;
          case 'navigate-next-asset':
            this.handleNavigateNextAsset();
            break;
        }
      });
  }
}
