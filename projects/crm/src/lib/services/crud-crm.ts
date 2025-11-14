import { Injectable, signal } from '@angular/core';
import { Contact, Lead, Stage } from '../interfaces/crm';

@Injectable({
  providedIn: 'root',
})
export class CrudCrm {
  private initialLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Alice Johnson',
      company: 'Innovate Corp',
      stage: 'New',
      description:
        'Initial contact made through website form. Interested in our enterprise package.',
      contactId: 'contact-1',
    },
    {
      id: 'lead-2',
      name: 'Bob Williams',
      company: 'Data Solutions',
      stage: 'Contacted',
      description: 'Follow-up call scheduled for next week.',
      contactId: 'contact-2',
    },
    {
      id: 'lead-3',
      name: 'Charlie Brown',
      company: 'Tech Gadgets',
      stage: 'New',
      description: 'Met at the tech conference. Showed interest in product demo.',
      contactId: null,
    },
    {
      id: 'lead-4',
      name: 'Diana Miller',
      company: 'Global Exports',
      stage: 'Qualified',
      description: 'Demo completed, proposal sent. Decision maker is on board.',
      contactId: 'contact-1',
    },
    {
      id: 'lead-5',
      name: 'Ethan Davis',
      company: 'Creative Minds',
      stage: 'Won',
      description: 'Contract signed. Onboarding process initiated.',
      contactId: 'contact-3',
    },
    {
      id: 'lead-6',
      name: 'Fiona Garcia',
      company: 'HealthFirst Inc.',
      stage: 'Lost',
      description: 'Chose a competitor due to pricing.',
      contactId: 'contact-2',
    },
    {
      id: 'lead-7',
      name: 'George Rodriguez',
      company: 'NextGen AI',
      stage: 'Qualified',
      description: 'Very promising lead. Budget approved.',
      contactId: 'contact-3',
    },
    {
      id: 'lead-8',
      name: 'Hannah Martinez',
      company: 'Synergy Group',
      stage: 'Contacted',
      description: 'Sent initial brochure and pricing information.',
      contactId: null,
    },
  ];

  private initialContacts: Contact[] = [
    { id: 'contact-1', name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=contact-1' },
    { id: 'contact-2', name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=contact-2' },
    { id: 'contact-3', name: 'Peter Jones', avatarUrl: 'https://i.pravatar.cc/150?u=contact-3' },
  ];

  leads = signal<Lead[]>(this.initialLeads);
  contacts = signal<Contact[]>(this.initialContacts);
  stages = signal<Stage[]>(['New', 'Contacted', 'Qualified', 'Won', 'Lost']);

  updateLead(updatedLead: Lead) {
    this.leads.update(currentLeads =>
      currentLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
    );
  }
}
