import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type assetRosterMaintenanceContextEvent =
  | 'toggle-edit'
  | 'save'
  | 'saved'
  | 'cancel'
  | 'open-commission-dialog'
  | 'commission'
  | 'open-decommission-dialog'
  | 'decommission'
  | 'open-service-dialog'
  | 'service'
  | 'open-finish-service-dialog'
  | 'finish-service'
  | 'add-document'
  | 'open-finish-pm-dialog'
  | 'finish-pm'
  | 'init-pm'
  | 'open-skip-pm'
  | 'skip-pm'
  | 'back-to-dashboard'
  | 'activity-history-add-file'
  | 'export-activity-history';

@Injectable({
  providedIn: 'root',
})
export class AssetRosterMaintenanceContext {
  private _handleEvents = new Subject<assetRosterMaintenanceContextEvent>();

  handleEvents$ = this._handleEvents.asObservable();

  toggleEditMode() {
    this._handleEvents.next('toggle-edit');
  }

  handleSave() {
    this._handleEvents.next('save');
  }

  handleSaved() {
    this._handleEvents.next('saved');
  }

  handleCancel() {
    this._handleEvents.next('cancel');
  }

  handleOpenCommissionDialog() {
    this._handleEvents.next('open-commission-dialog');
  }

  handleCommission() {
    this._handleEvents.next('commission');
  }

  handleOpenDecommissionDialog() {
    this._handleEvents.next('open-decommission-dialog');
  }

  handleDecommission() {
    this._handleEvents.next('decommission');
  }

  handleOpenServiceDialog() {
    this._handleEvents.next('open-service-dialog');
  }

  handleService() {
    this._handleEvents.next('service');
  }

  handleOpenFinishServiceDialog() {
    this._handleEvents.next('open-finish-service-dialog');
  }

  handleFinishService() {
    this._handleEvents.next('finish-service');
  }

  handleAddDocument() {
    this._handleEvents.next('add-document');
  }

  handleOpenFinishPMDialog() {
    this._handleEvents.next('open-finish-pm-dialog');
  }

  handleFinishPM() {
    this._handleEvents.next('finish-pm');
  }

  handleInitPM() {
    this._handleEvents.next('init-pm');
  }

  handleOpenSkipPMDialog() {
    this._handleEvents.next('open-skip-pm');
  }

  handleSkipPM() {
    this._handleEvents.next('skip-pm');
  }

  handleBackToDashboard() {
    this._handleEvents.next('back-to-dashboard');
  }

  handleActivityHistoryAddFile() {
    this._handleEvents.next('activity-history-add-file');
  }

  handleExportActivityHistory() {
    this._handleEvents.next('export-activity-history');
  }
}
