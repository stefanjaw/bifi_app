import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { FilterManager } from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { assetRoster } from '../../../interfaces/asset-roster';
import { UpdateAssetRosterForm } from '../../../services/update-asset-roster-form';
import { assetType } from '../../../../asset-types';
import { CrudAssetMaintenances } from '../../../../asset-maintenances';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

interface DepreciationResults {
  currentBookValue: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  remainingYears: number;
  valid: boolean;
}

@Component({
  selector: 'bifi-app-asset-roster-financial-information',
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
    CardModule,
    CommonModule,
    SelectModule,
    FormModule,
    ChartModule,
    TagModule,
  ],
  templateUrl: './financial-information.html',
})
export class FinancialInformation {
  assetRoster = input.required<assetRoster | undefined>();
  assetTypes = input<assetType[]>([]);
  isEditMode = input.required<boolean>();
  formService = inject(UpdateAssetRosterForm);
  form = this.formService.form;
  private filterManager = inject(FilterManager);
  private crudAssetMaintenances = inject(CrudAssetMaintenances);

  private serviceMaintenanceQuery = computed(() => {
    const id = this.assetRoster()?._id;
    if (!id) return {};
    return this.filterManager.getFilterObjectUtil([
      {
        operator: 'and',
        filters: [
          { field: 'assetRosterId', operator: '==', value: id },
          { field: 'type', operator: '==', value: 'service' },
        ],
      },
    ]);
  });

  serviceMaintenances = this.crudAssetMaintenances.get({
    searchParams: this.serviceMaintenanceQuery,
    getInactive: null,
  });

  depreciationMethodOptions = [
    { label: 'Straight Line', value: 'straight-line' },
    { label: 'Accelerated (Declining Balance)', value: 'accelerated-declining-balance' },
  ];

  tcoRanges = ['1W', '1M', '3M', '6M', 'YTD', '1Y', 'All'];
  selectedTcoRange = signal<string>('1Y');

  private acquiredPrice = toSignal(
    this.form.controls.acquiredPrice.valueChanges.pipe(
      startWith(this.form.controls.acquiredPrice.value),
    ),
  );

  private commissionedDate = toSignal(
    this.form.controls.commissionedDate.valueChanges.pipe(
      startWith(this.form.controls.commissionedDate.value),
    ),
  );

  private estimatedEconomicLifeYears = toSignal(
    this.form.controls.estimatedEconomicLifeYears.valueChanges.pipe(
      startWith(this.form.controls.estimatedEconomicLifeYears.value),
    ),
  );

  private salvageValue = toSignal(
    this.form.controls.salvageValue.valueChanges.pipe(
      startWith(this.form.controls.salvageValue.value),
    ),
  );

  private depreciationMethod = toSignal(
    this.form.controls.depreciationMethod.valueChanges.pipe(
      startWith(this.form.controls.depreciationMethod.value),
    ),
  );

  private accelerationFactor = toSignal(
    this.form.controls.accelerationFactor.valueChanges.pipe(
      startWith(this.form.controls.accelerationFactor.value),
    ),
  );

  isAccelerated = computed(() => this.depreciationMethod() === 'accelerated-declining-balance');

  depreciationResults = computed<DepreciationResults>(() => {
    const cost = this.acquiredPrice() ?? 0;
    const salvage = this.salvageValue() ?? 0;
    const life = this.estimatedEconomicLifeYears() ?? 0;
    const method = this.depreciationMethod() ?? 'straight-line';
    const factor = (this.accelerationFactor() ?? 200) / 100;
    const acqDate = this.commissionedDate() ?? this.form.controls.commissionedDate.value;

    if (!cost || !life || cost <= 0 || life <= 0) {
      return { currentBookValue: 0, annualDepreciation: 0, accumulatedDepreciation: 0, remainingYears: 0, valid: false };
    }

    const today = new Date();
    const startDate = acqDate ? new Date(acqDate) : null;
    const ageInYears = startDate
      ? (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      : 0;

    const remainingYears = Math.max(0, life - ageInYears);

    if (method === 'straight-line') {
      const depreciableBase = Math.max(0, cost - salvage);
      const annualDepreciation = depreciableBase / life;
      const accumulatedDepreciation = Math.min(depreciableBase, annualDepreciation * ageInYears);
      const currentBookValue = cost - accumulatedDepreciation;
      return { currentBookValue, annualDepreciation, accumulatedDepreciation, remainingYears, valid: true };
    } else {
      const rate = factor / life;
      let calculatedBV = cost * Math.pow(1 - rate, ageInYears);
      calculatedBV = Math.max(salvage, calculatedBV);
      const accumulatedDepreciation = cost - calculatedBV;
      const bvStartOfYear = cost * Math.pow(1 - rate, Math.floor(ageInYears));
      const annualDepreciation = Math.max(0, bvStartOfYear * rate - Math.max(0, salvage - calculatedBV));
      return { currentBookValue: calculatedBV, annualDepreciation, accumulatedDepreciation, remainingYears, valid: true };
    }
  });

  tcoChartData = computed(() => {
    const serviceEvents = this.serviceMaintenances.value() ?? [];
    const range = this.selectedTcoRange();

    if (!serviceEvents.length) return null;

    const now = new Date();
    let cutoff: Date | null = null;
    if (range === '1W') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (range === '1M') cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    else if (range === '3M') cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    else if (range === '6M') cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    else if (range === 'YTD') cutoff = new Date(now.getFullYear(), 0, 1);
    else if (range === '1Y') cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const filtered = cutoff
      ? serviceEvents.filter(e => new Date(e.dateStart) >= cutoff!)
      : serviceEvents;

    if (!filtered.length) return null;

    const monthCounts: Record<string, number> = {};
    for (const e of filtered) {
      const d = new Date(e.dateStart);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[key] = (monthCounts[key] ?? 0) + 1;
    }

    const labels = Object.keys(monthCounts).sort();
    const data = labels.map(l => monthCounts[l]);

    return {
      labels,
      datasets: [
        {
          label: 'Service Events',
          data,
          backgroundColor: 'rgba(99,102,241,0.6)',
          borderColor: 'rgba(99,102,241,1)',
          borderWidth: 1,
        },
      ],
    };
  });

  tcoChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  setTcoRange(range: string) {
    this.selectedTcoRange.set(range);
  }
}
