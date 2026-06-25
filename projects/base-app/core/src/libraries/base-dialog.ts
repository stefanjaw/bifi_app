import { Component, model } from '@angular/core';

/**
 * @description
 * BaseDialog is a helper class for creating dialogs in Angular components.
 *
 * @example
 * class MyDialog extends BaseDialog {
 *   // Your dialog class
 * }
 *
 */
@Component({ template: '' })
export class BaseDialog {
  protected dialogState = model(false);

  /** Opens the dialog by setting the dialog state to true */
  openDialog() {
    this.dialogState.set(true);
  }

  /** Closes the dialog by setting the dialog state to false */
  closeDialog() {
    this.dialogState.set(false);
  }
}
