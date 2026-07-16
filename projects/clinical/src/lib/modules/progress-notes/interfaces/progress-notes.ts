/** A progress note attached to a care continuum and patient */
export interface progressNote {
  _id: string;
  careContinuumId: string;
  patientId: string;
  contentTitle: string;
  date?: string;
  notes: string[];
  readBy: { userId: string; status: 'read' | 'unread' | 'updated' }[];
  byName: string;
  type: string;
  progressNoteType: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** An individual note entry within a progress note */
export interface note {
  _id: string;
  careContinuumId: string;
  progressNoteId: string;
  patientId: string;
  date?: string;
  contentBody: string;
  byName: string;
  state: 'Read' | 'Unread';
  type: string;
  progressNoteTagIds: string[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** A tag (adverse or incident) that can be assigned to a progress note */
export interface patientProgressNoteTag {
  _id: string;
  name: string;
  description: string;
  type: 'adverse' | 'incident';
  active: boolean;
}
