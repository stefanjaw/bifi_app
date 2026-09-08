import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudInventoryValuation } from '../../services/crud-inventory-valuation';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { CrudLocations } from '../../services/crud-locations';
import { CrudProducts } from '../../services/crud-products';
import { CrudProductTypes } from '../../services/crud-product-types';
import {
  valuationMode,
  valuationQuery,
  valuationReport,
} from '../../interfaces/inventory-valuation';
import { location } from '../../interfaces/location';
import { product } from '../../interfaces/product';
import { productType } from '../../interfaces/product-type';
import { warehouse } from '../../interfaces/warehouse';
import { TranslatePipe } from '@avalantec/base-app/i18n';

/** Summary line of the date range report */
interface rangeSummaryCard {
  label: string;
  value: number;
  emphasis: 'neutral' | 'positive' | 'negative' | 'result';
}

@Component({
  selector: 'bifi-app-valuation-report',
  host: {
    class: 'flex flex-col gap-6 p-6 ms-4 me-4',
  },
  imports: [
    FormsModule,
    DatePickerModule,
    SelectModule,
    ProgressBarModule,
    CurrencyPipe,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './valuation-report.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValuationReport {
  private crudValuation = inject(CrudInventoryValuation);
  private crudWarehouses = inject(CrudWarehouses);
  private crudLocations = inject(CrudLocations);
  private crudProducts = inject(CrudProducts);
  private crudProductTypes = inject(CrudProductTypes);

  /** Report mode: point-in-time (AS_OF) or period (DATE_RANGE) */
  mode = signal<valuationMode>('AS_OF');

  /** Selected instant for the AS_OF report (today by default) */
  asOfDate = signal<Date>(new Date());

  /** Selected [from, to] instants for the range mode */
  rangeDates = signal<Date[] | null>(null);

  /** Optional single-dimension filters (empty string = all) */
  warehouseFilter = signal<string>('');
  locationFilter = signal<string>('');
  productFilter = signal<string>('');
  productTypeFilter = signal<string>('');

  private warehousesResource = this.crudWarehouses.get({});
  private locationsResource = this.crudLocations.get({});
  private productsResource = this.crudProducts.get({});
  private productTypesResource = this.crudProductTypes.get({});

  reportResource = this.crudValuation.getValuation(() => this.buildQuery());

  report = this.reportResource.value;
  isLoading = this.reportResource.isLoading;
  error = this.reportResource.error;

  warehouses = computed(() =>
    ((this.warehousesResource.value() as warehouse[]) ?? []).map(w => ({
      label: w.name,
      value: w._id,
    }))
  );

  productTypes = computed(() =>
    ((this.productTypesResource.value() as productType[]) ?? []).map(t => ({
      label: t.name,
      value: t._id,
    }))
  );

  products = computed(() =>
    ((this.productsResource.value() as product[]) ?? []).map(p => ({
      label: `${p.name} (${p.sku})`,
      value: p._id,
    }))
  );

  locations = computed(() => {
    const all = (this.locationsResource.value() as location[]) ?? [];
    const selectedWarehouse = this.warehouseFilter();
    const filtered = selectedWarehouse
      ? all.filter(l => l.warehouseId?._id === selectedWarehouse)
      : all;
    return filtered.map(l => ({ label: l.name, value: l._id }));
  });

  /**
   * Builds the current valuation query from the filter signals.
   * @returns The reactive valuation query for the report resource.
   */
  buildQuery(): valuationQuery {
    const mode = this.mode();
    const query: valuationQuery = { mode };
    if (mode === 'AS_OF') {
      const selected = this.asOfDate();
      if (selected) {
        query.asOfDate = selected.toISOString();
      }
    } else {
      const range = this.rangeDates();
      if (range && range[0] && range[1]) {
        query.fromDate = range[0].toISOString();
        query.toDate = range[1].toISOString();
      }
    }
    if (this.warehouseFilter()) query.warehouseId = this.warehouseFilter();
    if (this.locationFilter()) query.locationId = this.locationFilter();
    if (this.productFilter()) query.productId = this.productFilter();
    if (this.productTypeFilter()) query.productTypeId = this.productTypeFilter();
    return query;
  }

  /**
   * Changes the report mode and pre-fills the range with the current month when entering range mode.
   * @param mode - The selected report mode.
   */
  setMode(mode: valuationMode) {
    this.mode.set(mode);
    if (mode === 'DATE_RANGE' && !this.rangeDates()) {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      this.rangeDates.set([monthStart, today]);
    }
  }

  /**
   * Clears the location filter when the warehouse filter changes so a
   * location from another warehouse is never combined with a new warehouse.
   * @param warehouseId - The newly selected warehouse id (empty = all).
   */
  onWarehouseChange(warehouseId: string) {
    this.warehouseFilter.set(warehouseId ?? '');
    this.locationFilter.set('');
  }

  /**
   * Range cards of the DATE_RANGE report (value movements within the period).
   * @param report - The current range report.
   * @returns The summary cards to render.
   */
  rangeSummary(report: valuationReport): rangeSummaryCard[] {
    if (report.mode !== 'DATE_RANGE') {
      return [];
    }
    return [
      { label: 'beginningValue', value: report.beginningValue, emphasis: 'neutral' },
      { label: 'incomingValue', value: report.incomingValue, emphasis: 'positive' },
      { label: 'outgoingValue', value: -report.outgoingValue, emphasis: 'negative' },
      { label: 'adjustmentsValue', value: report.adjustmentsValue, emphasis: 'neutral' },
      { label: 'endingValue', value: report.endingValue, emphasis: 'result' },
    ];
  }
}
