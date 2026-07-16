import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for fluid track create/edit */
export interface FluidTrackFormModel {
  _id: string;
  dayFluidTrack: string;
  fluidTracks: string[];
  patientId: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for fluid track create/edit */
@Injectable({ providedIn: 'root' })
export class FluidTrackForm extends BaseForm<FluidTrackFormModel> {
  override createForm() {
    return this.fb.group<FluidTrackFormModel>({
      _id: [''],
      dayFluidTrack: [''],
      fluidTracks: { template: [''], formArrayElements: [] },
      patientId: [''],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
