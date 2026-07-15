import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { injectAuthService } from '../../libraries/providers/auth-service-provider';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseDialog, ToastManager } from '@avalantec/base-app/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextareaModule } from 'primeng/textarea';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-access-token-dialog',
  imports: [ButtonModule, DialogModule, ClipboardModule, TextareaModule, TranslatePipe],
  templateUrl: './access-token-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessTokenDialog extends BaseDialog {
  private auth = injectAuthService();
  private toastManager = inject(ToastManager);

  token = toSignal(this.auth.idToken$);

  showTokenCopiedToast() {
    this.toastManager.showSuccess('Token copied to clipboard');
  }
}
