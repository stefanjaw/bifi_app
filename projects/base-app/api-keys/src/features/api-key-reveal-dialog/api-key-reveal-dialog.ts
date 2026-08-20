import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { BaseDialog, ToastManager } from '@avalantec/base-app/core';
import { TranslationService, TranslatePipe } from '@avalantec/base-app/i18n';

/**
 * Reveal-once dialog shown right after an API key is created. It displays the raw
 * key (only ever returned a single time by the backend) with a copy-to-clipboard
 * action and a confirm button that closes the dialog.
 */
@Component({
  selector: 'bifi-app-api-key-reveal-dialog',
  imports: [ButtonModule, DialogModule, TextareaModule, ClipboardModule, TranslatePipe],
  templateUrl: './api-key-reveal-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeyRevealDialog extends BaseDialog {
  private toastManager = inject(ToastManager);
  private translationService = inject(TranslationService);

  /** The one-time raw API key to reveal. */
  key = input<string>('');

  /** Shows a "copied" toast when the key is copied to the clipboard. */
  showKeyCopiedToast() {
    this.toastManager.showSuccess(
      this.translationService.translate('revealDialog.copied', {}, 'base-app/api-keys')
    );
  }
}
