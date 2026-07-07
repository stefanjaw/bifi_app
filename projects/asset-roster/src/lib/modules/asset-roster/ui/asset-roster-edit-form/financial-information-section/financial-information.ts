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
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

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
    TranslatePipe,
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
  private translationService = inject(TranslationService);

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

  private pmMaintenanceQuery = computed(() => {
    const id = this.assetRoster()?._id;
    if (!id) return {};
    return this.filterManager.getFilterObjectUtil([
      {
        operator: 'and',
        filters: [
          { field: 'assetRosterId', operator: '==', value: id },
          { field: 'type', operator: '==', value: 'preventive-maintenance' },
        ],
      },
    ]);
  });

  serviceMaintenances = this.crudAssetMaintenances.get({
    searchParams: this.serviceMaintenanceQuery,
    getInactive: null,
  });

  pmMaintenances = this.crudAssetMaintenances.get({
    searchParams: this.pmMaintenanceQuery,
    getInactive: null,
  });

  depreciationMethodOptions = computed(() => [
    {
      label: this.translationService.translate('straightLine', {}, 'asset-roster'),
      value: 'straight-line',
    },
    {
      label: this.translationService.translate('acceleratedDecliningBalance', {}, 'asset-roster'),
      value: 'accelerated-declining-balance',
    },
  ]);

  tcoRanges = ['1W', '1M', '3M', '6M', 'YTD', '1Y', 'All'];
  selectedTcoRange = signal<string>('1Y');
  showServiceCost = signal<boolean>(true);
  showPmCost = signal<boolean>(true);
  chartType = signal<'bar' | 'line'>('bar');
  stackedBars = signal<boolean>(false);

  private acquiredPrice = toSignal(
    this.form.controls.acquiredPrice.valueChanges.pipe(
      startWith(this.form.controls.acquiredPrice.value)
    )
  );

  private currentPrice = toSignal(
    this.form.controls.currentPrice.valueChanges.pipe(
      startWith(this.form.controls.currentPrice.value)
    )
  );

  private commissionedDate = toSignal(
    this.form.controls.commissionedDate.valueChanges.pipe(
      startWith(this.form.controls.commissionedDate.value)
    )
  );

  private estimatedEconomicLifeYears = toSignal(
    this.form.controls.estimatedEconomicLifeYears.valueChanges.pipe(
      startWith(this.form.controls.estimatedEconomicLifeYears.value)
    )
  );

  private salvageValue = toSignal(
    this.form.controls.salvageValue.valueChanges.pipe(
      startWith(this.form.controls.salvageValue.value)
    )
  );

  private depreciationMethod = toSignal(
    this.form.controls.depreciationMethod.valueChanges.pipe(
      startWith(this.form.controls.depreciationMethod.value)
    )
  );

  private accelerationFactor = toSignal(
    this.form.controls.accelerationFactor.valueChanges.pipe(
      startWith(this.form.controls.accelerationFactor.value)
    )
  );

  isAccelerated = computed(() => this.depreciationMethod() === 'accelerated-declining-balance');

  depreciationResults = computed<DepreciationResults>(() => {
    const acquiredPrice = this.acquiredPrice();
    const currentPrice = this.currentPrice();
    const cost = (acquiredPrice && acquiredPrice > 0 ? acquiredPrice : currentPrice) ?? 0;
    const salvage = this.salvageValue() ?? 0;
    const life = this.estimatedEconomicLifeYears() ?? 0;
    const method = this.depreciationMethod() ?? 'straight-line';
    const factor = (this.accelerationFactor() ?? 200) / 100;
    const acqDate = this.commissionedDate() ?? this.form.controls.commissionedDate.value;

    if (!cost || !life || cost <= 0 || life <= 0) {
      return {
        currentBookValue: 0,
        annualDepreciation: 0,
        accumulatedDepreciation: 0,
        remainingYears: 0,
        valid: false,
      };
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
      return {
        currentBookValue,
        annualDepreciation,
        accumulatedDepreciation,
        remainingYears,
        valid: true,
      };
    } else {
      const rate = factor / life;
      let calculatedBV = cost * Math.pow(1 - rate, ageInYears);
      calculatedBV = Math.max(salvage, calculatedBV);
      const accumulatedDepreciation = cost - calculatedBV;
      const bvStartOfYear = cost * Math.pow(1 - rate, Math.floor(ageInYears));
      const annualDepreciation = Math.max(
        0,
        bvStartOfYear * rate - Math.max(0, salvage - calculatedBV)
      );
      return {
        currentBookValue: calculatedBV,
        annualDepreciation,
        accumulatedDepreciation,
        remainingYears,
        valid: true,
      };
    }
  });

  private getCutoff(range: string): Date | null {
    const now = new Date();
    if (range === '1W') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (range === '1M') return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    if (range === '3M') return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    if (range === '6M') return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    if (range === 'YTD') return new Date(now.getFullYear(), 0, 1);
    if (range === '1Y') return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return null;
  }

  private tcoFilteredService = computed(() => {
    const events = this.serviceMaintenances.value() ?? [];
    const cutoff = this.getCutoff(this.selectedTcoRange());
    return cutoff ? events.filter(e => new Date(e.dateStart) >= cutoff!) : events;
  });

  private tcoFilteredPM = computed(() => {
    const events = this.pmMaintenances.value() ?? [];
    const cutoff = this.getCutoff(this.selectedTcoRange());
    return cutoff ? events.filter(e => new Date(e.dateStart) >= cutoff!) : events;
  });

  totalMaintenanceCost = computed(() => {
    let total = 0;
    if (this.showServiceCost()) {
      total += this.tcoFilteredService().reduce((sum, e) => sum + (e.cost ?? 0), 0);
    }
    if (this.showPmCost()) {
      total += this.tcoFilteredPM().reduce((sum, e) => sum + (e.cost ?? 0), 0);
    }
    return total;
  });

  tcoChartData = computed(() => {
    const serviceEvents = this.tcoFilteredService();
    const pmEvents = this.tcoFilteredPM();
    const showService = this.showServiceCost();
    const showPm = this.showPmCost();
    const isLine = this.chartType() === 'line';

    if (!serviceEvents.length && !pmEvents.length) return null;

    const allMonths = new Set<string>();
    const addMonths = (events: typeof serviceEvents) => {
      for (const e of events) {
        const d = new Date(e.dateStart);
        allMonths.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }
    };
    addMonths(serviceEvents);
    addMonths(pmEvents);

    if (!allMonths.size) return null;

    const labels = Array.from(allMonths).sort();

    const sumByMonth = (events: typeof serviceEvents): number[] => {
      const map: Record<string, number> = {};
      for (const e of events) {
        const d = new Date(e.dateStart);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        map[key] = (map[key] ?? 0) + (e.cost ?? 0);
      }
      return labels.map(l => map[l] ?? 0);
    };

    const datasets: any[] = [];

    if (showService) {
      datasets.push({
        label: this.translationService.translate('serviceCost', {}, 'asset-roster'),
        data: sumByMonth(serviceEvents),
        backgroundColor: isLine ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.6)',
        borderColor: 'rgba(249,115,22,1)',
        borderWidth: isLine ? 2 : 1,
        ...(isLine ? { fill: 'origin', tension: 0.4, pointRadius: 4 } : {}),
      });
    }

    if (showPm) {
      datasets.push({
        label: this.translationService.translate('pmCost', {}, 'asset-roster'),
        data: sumByMonth(pmEvents),
        backgroundColor: isLine ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.6)',
        borderColor: 'rgba(34,197,94,1)',
        borderWidth: isLine ? 2 : 1,
        ...(isLine ? { fill: showService ? '-1' : 'origin', tension: 0.4, pointRadius: 4 } : {}),
      });
    }

    if (!datasets.length) return null;

    const allZero = datasets.every(ds => (ds.data as number[]).every(v => v === 0));
    if (allZero) return null;

    return { labels, datasets };
  });

  tcoChartOptions = computed(() => {
    const stacked = this.chartType() === 'bar' && this.stackedBars();
    return {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.5,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const value = ctx.parsed.y ?? 0;
              return ' ' + value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            },
          },
        },
      },
      scales: {
        x: { stacked },
        y: {
          stacked,
          beginAtZero: true,
          ticks: {
            callback: (value: number) =>
              value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }),
          },
        },
      },
    };
  });

  setTcoRange(range: string) {
    this.selectedTcoRange.set(range);
  }

  toggleServiceCost() {
    this.showServiceCost.update(v => !v);
  }

  togglePmCost() {
    this.showPmCost.update(v => !v);
  }

  setChartType(type: 'bar' | 'line') {
    this.chartType.set(type);
  }

  toggleStackedBars() {
    this.stackedBars.update(v => !v);
  }
}
