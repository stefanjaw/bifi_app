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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private activityHistoriesService = inject(CrudActivityHistories);
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

  activityHistories = this.activityHistoriesService.get<
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

  // State
  isEditMode = signal(false);

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

  handleSave() {
    const { dirtyValue: value } = this.formService.getValueState();

    this.submitLoading.set(true);

    const assetRosterRequest = this.crudAssetRoster.put({
      _id: this.assetRoster()?._id || '',
      fileFields: ['photo'],
      data: {
        ...value,
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
      },
    });

    assetRosterRequest.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.isEditMode.set(false);
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
    this.resetValueToInitialState(this.assetRoster());
    this.isEditMode.set(false);
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
    this.router.navigate(['asset-roster', 'equipment', 'list']);
  }

  handleReloadAssetRoster() {
    this.assetRosterResource.reload();
    this.activityHistories.reload();
  }

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

    this.formService.patchValue({
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
        }
      });
  }
}
