import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudPricingEstimate } from '../../services/crud-pricing-estimate';
import { pricingEstimate, pricingEstimateLineItem } from '../../interfaces/pricing-estimate';

@Component({
  selector: 'bifi-app-pricing-estimate-output',
  imports: [
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
    ButtonModule,
    ToggleSwitchModule,
    TableModule,
    ProgressBarModule,
    TagModule,
    FormsModule,
  ],
  templateUrl: './pricing-estimate-output.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingEstimateOutput implements OnInit {
  private route = inject(ActivatedRoute);
  private crudEstimate = inject(CrudPricingEstimate);
  private destroy$ = inject(DestroyRef);

  protected estimate = signal<pricingEstimate | null>(null);
  protected loading = signal(true);
  protected isDistributorView = signal(true);
  protected downloadingPdf = signal(false);
  protected downloadingCsv = signal(false);

  protected lineItems = computed(() => this.estimate()?.lineItems ?? []);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.crudEstimate
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: data => {
          this.estimate.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  protected toggleView() {
    this.isDistributorView.update(v => !v);
  }

  protected downloadPdf() {
    const est = this.estimate();
    if (!est?._id) return;
    this.downloadingPdf.set(true);
    this.crudEstimate
      .getPdf(est._id)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: blob => {
          this.triggerDownload(blob, `estimate-${est.number}.pdf`);
          this.downloadingPdf.set(false);
        },
        error: () => this.downloadingPdf.set(false),
      });
  }

  protected downloadCsv() {
    const est = this.estimate();
    if (!est?._id) return;
    this.downloadingCsv.set(true);
    this.crudEstimate
      .getCsv(est._id)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: blob => {
          this.triggerDownload(blob, `estimate-${est.number}.csv`);
          this.downloadingCsv.set(false);
        },
        error: () => this.downloadingCsv.set(false),
      });
  }

  protected async copyEmail() {
    const est = this.estimate();
    if (!est) return;

    let text = `Pricing Estimate ${est.number}\n`;
    text += `Date: ${new Date(est.date).toLocaleDateString()}\n`;
    text += `Prepared by: ${est.preparedBy}\n\n`;
    text += `Product | Supplier | Qty | Cust. Price/Unit | Total\n`;
    text += `${'—'.repeat(60)}\n`;

    for (const li of est.lineItems) {
      text += `${li.product} | ${li.supplier} | ${li.qty} | $${li.custPricePerUnit.toFixed(2)} | $${li.totalCust.toFixed(2)}\n`;
    }

    text += `\nTotal Customer: $${est.totalCustomer.toFixed(2)}\n`;
    text += `\nWharfage & Bank Fees (${est.wharfageBankFeePct}%): $${est.wharfageBankFeeAmount.toFixed(2)}\n`;
    text += `\nDisclaimer: This estimate is based on current pricing data and AI analysis. `;
    text += `Actual costs may vary. All prices are subject to confirmation.`;

    await navigator.clipboard.writeText(text);
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
