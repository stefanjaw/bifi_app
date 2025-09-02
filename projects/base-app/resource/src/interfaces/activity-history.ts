export interface activityHistory<TDocument = Record<string, unknown>> {
  _id: string;
  title: string;
  details?: string;
  performDate: Date;
  model: string;
  modelId: TDocument;
  metadata?: any;
}
