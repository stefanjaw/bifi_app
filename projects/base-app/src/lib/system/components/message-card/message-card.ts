import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'bifi-app-message-card',
  imports: [MatIcon],
  host: { class: 'flex flex-col gap-2 p-3 rounded-md shadow-xl/30 w-full' },
  templateUrl: './message-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageCard {
  icon = input('');
  title = input('');
  subtitle = input('');
}
