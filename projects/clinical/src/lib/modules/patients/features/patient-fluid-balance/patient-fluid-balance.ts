import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudFluidTrackItems } from '../../../fluid-tracks/services/crud-fluid-track-items';
import { fluidTrackItem } from '../../../fluid-tracks/interfaces/fluid-tracks';

/** Fluid track intake/output balance view for a patient */
@Component({
  selector: 'bifi-app-patient-fluid-balance',
  imports: [CommonModule, CardModule, SkeletonModule, TableModule, TranslatePipe],
  templateUrl: './patient-fluid-balance.html',
  host: { class: 'flex flex-col gap-4 p-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientFluidBalance {
  private route = inject(ActivatedRoute);
  private crudFluidTrackItems = inject(CrudFluidTrackItems);
  private destroy$ = inject(DestroyRef);

  patientId = signal<string>('');
  items = signal<fluidTrackItem[]>([]);
  loading = signal(true);

  totalIntake = computed(() =>
    this.items().reduce((sum, item) => {
      return (
        sum +
        item.tracks
          .filter(t => t.name.toLowerCase().includes('intake'))
          .reduce((s, t) => s + t.value, 0)
      );
    }, 0)
  );

  totalOutput = computed(() =>
    this.items().reduce((sum, item) => {
      return (
        sum +
        item.tracks
          .filter(t => t.name.toLowerCase().includes('output'))
          .reduce((s, t) => s + t.value, 0)
      );
    }, 0)
  );

  balance = computed(() => this.totalIntake() - this.totalOutput());

  constructor() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('patientId');
      if (id) {
        this.patientId.set(id);
        this.fetchFluidData(id);
      }
    });
  }

  private fetchFluidData(patientId: string) {
    this.loading.set(true);
    this.crudFluidTrackItems
      .getByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: docs => {
          this.items.set(docs);
          this.loading.set(false);
        },
      });
  }
}
