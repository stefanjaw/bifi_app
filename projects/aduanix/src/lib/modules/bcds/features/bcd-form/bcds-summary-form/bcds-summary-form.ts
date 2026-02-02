import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'dist/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { BcdForm, BCDFormManager } from 'projects/aduanix/src/public-api';

@Component({
  selector: 'bifi-app-bcds-summary-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    TableModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule,
  ],
  templateUrl: './bcds-summary-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsSummaryForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
}
