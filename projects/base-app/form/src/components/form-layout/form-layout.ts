import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Text, TextVariant } from '@avalantec/base-app/core';
// import { FormNavigator } from '../form-navigator/form-navigator';

@Component({
  selector: 'bifi-app-form-layout',
  imports: [Text, CommonModule],
  templateUrl: './form-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLayout {
  title = input.required<string>();
  titlePosition = input<'left' | 'center' | 'right'>('left');
  titleVariant = input<TextVariant>('title-3');
}
