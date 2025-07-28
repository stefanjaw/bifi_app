import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type productMaintenanceContextEvent =
  | 'toggle-edit'
  | 'save'
  | 'cancel'
  | 'open-comission-dialog'
  | 'comission'
  | 'open-decommission-dialog'
  | 'decommission'
  | 'add-document'
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

  handleAddDocument() {
    this._handleEvents.next('add-document');
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
