import { ChangeDetectionStrategy, Component, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudCareContinuum } from '../../../care-continuum/services/crud-care-continuum';
import { CrudOrders } from '../../../clinical-orders/services/crud-orders';
import { CrudProgressNotes } from '../../../progress-notes/services/crud-progress-notes';
import { CrudVitalSigns } from '../../../vital-signs/services/crud-vital-signs';
import { CrudFluidTracks } from '../../../fluid-tracks/services/crud-fluid-tracks';

/** Patient summary dashboard with cards showing clinical data overview */
@Component({
  selector: 'bifi-app-patient-summary',
  imports: [CommonModule, CardModule, SkeletonModule, RouterLink, TranslatePipe],
  templateUrl: './patient-summary.html',
  host: { class: 'flex flex-col gap-4 p-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientSummary {
  private route = inject(ActivatedRoute);
  private destroy$ = inject(DestroyRef);
  private crudCareContinuum = inject(CrudCareContinuum);
  private crudOrders = inject(CrudOrders);
  private crudProgressNotes = inject(CrudProgressNotes);
  private crudVitalSigns = inject(CrudVitalSigns);
  private crudFluidTracks = inject(CrudFluidTracks);

  patientId = signal<string>('');
  careContinuumCount = signal<number>(0);
  ordersCount = signal<number>(0);
  progressNotesCount = signal<number>(0);
  vitalSignsCount = signal<number>(0);
  fluidTracksCount = signal<number>(0);
  loaded = signal(false);

  constructor() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('patientId');
      if (id) {
        this.patientId.set(id);
        this.fetchCounts(id);
      }
    });
  }

  private fetchCounts(patientId: string) {
    this.crudCareContinuum
      .getCountByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(c => this.careContinuumCount.set(c));

    this.crudOrders
      .getCountByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(c => this.ordersCount.set(c));

    this.crudProgressNotes
      .getCountByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(c => this.progressNotesCount.set(c));

    this.crudVitalSigns
      .getCountByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(c => this.vitalSignsCount.set(c));

    this.crudFluidTracks
      .getCountByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(c => {
        this.fluidTracksCount.set(c);
        this.loaded.set(true);
      });
  }
}
