import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CrudCrm } from '../../services/crud-crm';
import { Lead, Stage } from '../../interfaces/crm';
import { LeadDetailModal } from './lead-detail-modal/lead-detail-modal';
import { LeadCard } from './lead-card/lead-card';

@Component({
  selector: 'bifi-app-leads',
  imports: [LeadDetailModal, LeadCard],
  templateUrl: './leads.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leads {
  private crudCRM = inject(CrudCrm);

  stages = this.crudCRM.stages;
  leadsByStage = computed(() => {
    const leads = this.crudCRM.leads();
    return this.stages().reduce(
      (acc, stage) => {
        acc[stage] = leads.filter(lead => lead.stage === stage);
        return acc;
      },
      {} as Record<Stage, Lead[]>
    );
  });
  contacts = this.crudCRM.contacts;

  selectedLead = signal<Lead | null>(null);

  // Signals for Drag and Drop
  draggedLeadId = signal<string | null>(null);
  draggedOverStage = signal<Stage | null>(null);

  getContactForLead = (lead: Lead) => {
    return this.contacts().find(c => c.id === lead.contactId) || null;
  };

  onSelectLead(lead: Lead) {
    this.selectedLead.set(lead);
  }

  onCloseModal() {
    this.selectedLead.set(null);
  }

  onSaveLead(updatedLead: Lead) {
    this.crudCRM.updateLead(updatedLead);
    this.onCloseModal();
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, lead: Lead) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', lead.id);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedLeadId.set(lead.id);
  }

  onDragOver(event: DragEvent, stage: Stage) {
    event.preventDefault();
    if (this.draggedLeadId()) {
      this.draggedOverStage.set(stage);
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.draggedOverStage.set(null);
  }

  onDrop(event: DragEvent, stage: Stage) {
    event.preventDefault();
    const leadId = event.dataTransfer?.getData('text/plain');

    if (leadId) {
      const leadToUpdate = this.crudCRM.leads().find(l => l.id === leadId);
      if (leadToUpdate && leadToUpdate.stage !== stage) {
        this.crudCRM.updateLead({ ...leadToUpdate, stage });
      }
    }

    this.draggedLeadId.set(null);
    this.draggedOverStage.set(null);
  }

  onDragEnd() {
    this.draggedLeadId.set(null);
    this.draggedOverStage.set(null);
  }
}
