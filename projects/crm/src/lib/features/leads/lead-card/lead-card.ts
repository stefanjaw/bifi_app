import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Contact, Lead } from '../../../interfaces/crm';

@Component({
  selector: 'bifi-app-lead-card',
  imports: [NgOptimizedImage],
  templateUrl: './lead-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadCard {
  lead = input.required<Lead>();
  contact = input<Contact | null>();
}
