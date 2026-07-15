import { Component, inject, signal } from '@angular/core';
import { BaseDialog } from '@avalantec/base-app/core';
import { DialogModule } from 'primeng/dialog';
import { UpdateAssetRosterForm } from '../../services/update-asset-roster-form';
import { FormFileControlHelper } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-asset-roster-image-dialog',
  imports: [DialogModule],
  templateUrl: './asset-roster-image-dialog.html',
})
export class AssetRosterImageDialog extends BaseDialog {
  formService = inject(UpdateAssetRosterForm);
  private fileHelper = inject(FormFileControlHelper);

  form = this.formService.form;

  get photoArray() {
    return this.form.controls.photo;
  }

  private fileState = this.fileHelper.generateMetadataFromFileControl(this.photoArray);

  uploadedFile = this.fileState.firstFile;

  override openDialog(): void {
    super.openDialog();
  }

  override closeDialog(): void {
    super.closeDialog();
  }
}
