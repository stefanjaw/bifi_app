/** Clinical order set entity */
export interface orderSet {
  _id: string;
  careContinuumId: string;
  patientId: string;
  byName: string;
  type: string;
  priority: string;
  state: string;
  orders: { orderId: string }[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Clinical order entity */
export interface order {
  _id: string;
  orderSetId: string;
  patientId: string;
  subType: string;
  type: string;
  status: string;
  title: string;
  interventionId?: string;
  priority: string;
  results?: { fileId: string; description: string }[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Maintenance type reference for clinical orders */
export interface orderMaintenance {
  _id: string;
  name: string;
  color: string;
  createdBy: string;
  updatedBy: string;
}
