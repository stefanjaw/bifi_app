import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** A single entry within a fluid track item */
export interface fluidTrackItemEntry {
  name: string;
  value: number;
  description: string;
  dateFluidTrack: string;
  active: boolean;
  patientProgressNoteId: string;
}

/** Form model for fluid track item create/edit */
export interface FluidTrackItemFormModel {
  _id: string;
  tracks: fluidTrackItemEntry[];
  active: boolean;
}

/** Form service for fluid track item create/edit */
@Injectable({ providedIn: 'root' })
export class FluidTrackItemForm extends BaseForm<FluidTrackItemFormModel> {
  override createForm() {
    return this.fb.group<FluidTrackItemFormModel>({
      _id: [''],
      tracks: {
        template: {
          name: [''],
          value: [0],
          description: [''],
          dateFluidTrack: [''],
          active: [true],
          patientProgressNoteId: [''],
        },
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
