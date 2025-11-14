import { ChangeDetectionStrategy, Component, effect, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact, Lead, Stage } from '../../../interfaces/crm';

@Component({
  selector: 'bifi-app-lead-detail-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './lead-detail-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadDetailModal implements OnInit {
  lead = input.required<Lead>();
  stages = input.required<Stage[]>();
  contacts = input.required<Contact[]>();

  closed = output<void>();
  save = output<Lead>();

  private fb = new FormBuilder();

  leadForm = this.fb.group({
    id: [''],
    name: [''],
    company: [''],
    description: ['', Validators.required],
    stage: ['', Validators.required],
    contactId: [null as string | null],
  });

  constructor() {
    effect(() => {
      this.leadForm.reset(this.lead());
    });
  }

  ngOnInit() {
    this.leadForm.reset(this.lead());
  }

  onSave() {
    if (this.leadForm.valid) {
      this.save.emit(this.leadForm.getRawValue() as Lead);
    }
  }

  onClose() {
    this.closed.emit();
  }
}
