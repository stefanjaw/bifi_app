/** A daily fluid track record linked to a patient */
export interface fluidTrack {
  _id: string;
  dayFluidTrack: string;
  fluidTracks: string[];
  patientId: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** A collection of individual fluid track entries for a given day */
export interface fluidTrackItem {
  _id: string;
  tracks: {
    name: string;
    value: number;
    description: string;
    dateFluidTrack: string;
    active: boolean;
    patientProgressNoteId?: string;
  }[];
  active: boolean;
}
