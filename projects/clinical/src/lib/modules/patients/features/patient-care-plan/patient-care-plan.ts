import { ChangeDetectionStrategy, Component, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudAdmissionGoals } from '../../../care-plan/services/crud-admission-goals';
import { CrudInterventions } from '../../../care-plan/services/crud-interventions';
import { CrudOutcomes } from '../../../care-plan/services/crud-outcomes';
import { admissionGoal, intervention, outcome } from '../../../care-plan/interfaces/care-plan';

/** Care plan overview for a patient showing goals, interventions, and outcomes */
@Component({
  selector: 'bifi-app-patient-care-plan',
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule,
    ButtonModule,
    TagModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './patient-care-plan.html',
  host: { class: 'flex flex-col gap-4 p-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientCarePlan {
  private route = inject(ActivatedRoute);
  private destroy$ = inject(DestroyRef);
  private crudAdmissionGoals = inject(CrudAdmissionGoals);
  private crudInterventions = inject(CrudInterventions);
  private crudOutcomes = inject(CrudOutcomes);

  patientId = signal<string>('');
  goals = signal<admissionGoal[]>([]);
  interventions = signal<intervention[]>([]);
  outcomes = signal<outcome[]>([]);
  loading = signal(true);

  constructor() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('patientId');
      if (id) {
        this.patientId.set(id);
        this.fetchData(id);
      }
    });
  }

  private fetchData(patientId: string) {
    this.loading.set(true);

    this.crudAdmissionGoals
      .getByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => this.goals.set(res) });

    this.crudInterventions
      .getByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          this.interventions.set(res);
          this.loading.set(false);
        },
      });

    this.crudOutcomes
      .getByPatient(patientId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => this.outcomes.set(res) });
  }
}
