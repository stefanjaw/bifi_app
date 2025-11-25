import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { ProductStatusFilterManager } from '../../services/product-status-filter-manager';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { statusVariant } from '../../interfaces/product-status-card';

@Component({
  selector: 'bifi-app-product-status-select',
  imports: [FormsModule, Select],
  host: { class: 'w-full' },
  templateUrl: './product-status-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductStatusSelect {
  protected productStatusManager = inject(ProductStatusFilterManager);
  protected readonly options: { label: string; variant: statusVariant | 'all' }[] = [
    {
      label: 'All Statuses',
      variant: 'all',
    },
    {
      label: 'Active',
      variant: 'active',
    },
    {
      label: 'Awaiting commissioning',
      variant: 'awaiting-commissioning',
    },
    {
      label: 'Under Service',
      variant: 'under-service',
    },
    {
      label: 'Decommissioned',
      variant: 'decommissioned',
    },
    {
      label: 'Due',
      variant: 'due',
    },
    {
      label: 'Overdue',
      variant: 'overdue',
    },

    {
      label: 'In PM',
      variant: 'in-pm',
    },
    {
      label: 'PM Not Set',
      variant: 'pm-not-set',
    },
  ];

  variant = model<statusVariant | 'all'>(this.productStatusManager.currentVariant() || 'all');

  constructor() {
    effect(() => {
      this.variant.set(this.productStatusManager.currentVariant() || 'all');
    });
  }
}
