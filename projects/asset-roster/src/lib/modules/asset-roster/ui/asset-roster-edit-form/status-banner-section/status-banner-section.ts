import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { assetRoster } from '../../../interfaces/asset-roster';
import { Icon } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-status-banner-section',
  imports: [MessageModule, Icon],
  host: { class: 'w-full' },
  templateUrl: './status-banner-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBannerSection {
  assetRoster = input.required<assetRoster | undefined>();
}
