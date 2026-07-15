import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { tokenEstimation } from '../../interfaces/pricing-estimate';
import { TagModule } from 'primeng/tag';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-token-estimator-card',
  imports: [DecimalPipe, TagModule, TranslatePipe],
  templateUrl: './token-estimator-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenEstimatorCard {
  data = input<tokenEstimation | null>(null);
  loading = input(false);
}
