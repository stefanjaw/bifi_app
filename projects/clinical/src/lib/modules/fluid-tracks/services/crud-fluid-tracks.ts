import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { fluidTrack } from '../interfaces/fluid-tracks';

/** CRUD service for managing fluid tracks */
@Injectable({ providedIn: 'root' })
export class CrudFluidTracks extends ApiRequestManager<fluidTrack> {
  constructor() {
    super();
    this.endpoint = 'fluid-tracks';
  }
}
