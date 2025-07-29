import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type productMaintenanceContextEvent =
  | 'toggle-edit'
  | 'save'
  | 'saved'
  | 'cancel'
  | 'open-comission-dialog'
  | 'comission'
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
  | 'back-to-dashboard';

@Injectable({
  providedIn: 'root',
})
export class ProductMaintenanceContext {
  private _handleEvents = new Subject<productMaintenanceContextEvent>();

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

  handleOpenComissionDialog() {
    this._handleEvents.next('open-comission-dialog');
  }

  handleComission() {
    this._handleEvents.next('comission');
  }

  handleOpenDecomissionDialog() {
    this._handleEvents.next('open-decommission-dialog');
  }

  handleDecomission() {
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

  handleBackToDashboard() {
    this._handleEvents.next('back-to-dashboard');
  }
}
