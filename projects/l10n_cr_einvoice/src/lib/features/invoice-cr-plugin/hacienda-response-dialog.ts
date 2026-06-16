import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseDialog } from '@avalantec/base-app/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-l10n-hacienda-response-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './hacienda-response-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HaciendaResponseDialogComponent extends BaseDialog {
  responseXml = input<string | null>(null);

  decodedXml = computed(() => {
    const raw = this.responseXml();
    if (!raw) return '';
    try {
      return this.formatXml(atob(raw));
    } catch {
      return raw;
    }
  });

  private formatXml(xml: string): string {
    let formatted = '';
    let indent = 0;
    const lines = xml.replace(/>\s*</g, '>\n<').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^<\//.test(trimmed)) indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + trimmed + '\n';
      if (
        /^<[^/?!]/.test(trimmed) &&
        !/\/>$/.test(trimmed) &&
        !/<.*>.*<\/.*>$/.test(trimmed) &&
        !/^<\//.test(trimmed)
      ) {
        indent++;
      }
    }
    return formatted.trim();
  }
}
