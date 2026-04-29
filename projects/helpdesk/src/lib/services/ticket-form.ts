import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface TicketFormModel {
  name: string;
  description: string;
  internalNotes: string;
  priority: string;
  type: string;
  stage: string;
  assigned: string;
  senderUser: string;
  followers: string[];
  tagsInput: string;
  category: string;
  appModule: string;
  dateStart?: Date;
  dateEnd?: Date;
  dateScheduled?: Date;
  duration?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketForm extends BaseForm<TicketFormModel> {
  override createForm() {
    return this.fb.group<TicketFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      internalNotes: [''],
      priority: ['medium'],
      type: ['helpdesk'],
      stage: [''],
      assigned: [''],
      senderUser: [''],
      followers: {
        template: [''],
        formArrayElements: [],
      },
      dateStart: [new Date()],
      dateEnd: [new Date()],
      dateScheduled: [new Date()],
      duration: [''],
      tagsInput: [''],
      category: [''],
      appModule: [''],
    });
  }

  get followersArray() {
    return this.form.controls.followers;
  }

  addFollower(userId: string) {
    if (!userId) return;
    const current = this.followersArray.controls.map(c => c.value);
    if (!current.includes(userId)) {
      this.followersArray.pushItem(userId);
    }
  }

  removeFollower(index: number) {
    this.followersArray.removeAt(index);
  }
}
