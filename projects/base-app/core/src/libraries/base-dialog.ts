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

  openDialog() {
    this.dialogState.set(true);
  }

  closeDialog() {
    this.dialogState.set(false);
  }
}
