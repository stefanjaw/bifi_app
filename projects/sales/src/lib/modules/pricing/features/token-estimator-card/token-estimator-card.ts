import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { tokenEstimation } from '../../interfaces/pricing-estimate';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'bifi-app-token-estimator-card',
  imports: [DecimalPipe, TagModule],
  templateUrl: './token-estimator-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenEstimatorCardComponent {
  data = input<tokenEstimation | null>(null);
  loading = input(false);
}
