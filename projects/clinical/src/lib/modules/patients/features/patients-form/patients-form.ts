import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudPatients } from '../../services/crud-patients';
import { patient } from '../../interfaces/patient';

/** Patient shell component with router-outlet mounting clinical sub-pages */
@Component({
  selector: 'bifi-app-patients-form',
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './patients-form.html',
  host: { class: 'flex flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientsForm implements OnInit {
  private route = inject(ActivatedRoute);
  private crud = inject(CrudPatients);

  patientId: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('patientId');
    });
  }
}
