import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BcdForm } from '../../../services/bcd-form';
import { BCDFormManager } from '../../../services/bcd-form-manager';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormModule } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-bcds-summary-form',
  imports: [ReactiveFormsModule, FormModule, TableModule, DecimalPipe, DatePipe],
  templateUrl: './bcds-summary-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsSummaryForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);

  protected form = this.formService.form;
}
