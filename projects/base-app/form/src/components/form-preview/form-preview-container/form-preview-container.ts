import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { previewVariant } from '../form-preview.model';

@Component({
  selector: 'bifi-app-form-preview-container',
  imports: [CommonModule],
  templateUrl: './form-preview-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPreviewContainer {
  variant = input<previewVariant>('text');
}
