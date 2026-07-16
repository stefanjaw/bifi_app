/** Admission goal entity */
export interface admissionGoal {
  _id: string;
  careContinuumId: string;
  state: string;
  tracking: string;
  patientId: string;
  interventions: string[];
  archived: boolean;
  contentTitle: string;
  contentBody: string;
  priority: number;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Intervention entity */
export interface intervention {
  _id: string;
  admissionGoalId: string;
  state: string;
  patientId: string;
  archived: boolean;
  contentTitle: string;
  contentBody: string;
  outcomes: string[];
  orderSetIds: string[];
  orderIds: string[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Outcome entity */
export interface outcome {
  _id: string;
  interventionId: string;
  patientId: string;
  archived: boolean;
  contentTitle: string;
  contentBody: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}
