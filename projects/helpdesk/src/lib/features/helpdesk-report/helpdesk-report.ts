import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CrudTickets } from '../../services/crud-tickets';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { JsonPipe } from '@angular/common';

interface ReportData {
  byStage: { stage: string; count: number }[];
  resolutionTimeSpan: {
    avgMinutes: number | null;
    minMinutes: number | null;
    maxMinutes: number | null;
    buckets: { label: string; count: number }[];
  };
  byAssigned: {
    assigned: string;
    count: number;
    avgResolutionMinutes: number | null;
  }[];
}

@Component({
  selector: 'bifi-app-helpdesk-report',
  imports: [RouterLink, ButtonModule, TableModule, ProgressBarModule, JsonPipe],
  host: {
    class: 'flex flex-col gap-6 p-6 ms-4 me-4',
  },
  templateUrl: './helpdesk-report.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpdeskReport implements OnInit {
  private crudTickets = inject(CrudTickets);

  isLoading = signal(true);
  error = signal<string | null>(null);
  report = signal<ReportData | null>(null);

  ngOnInit() {
    this.crudTickets.getReport<ReportData>().subscribe({
      next: data => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set('Failed to load report data.');
        this.isLoading.set(false);
      },
    });
  }

  formatMinutes(minutes: number | null | undefined): string {
    if (minutes === null || minutes === undefined) return '—';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
}
