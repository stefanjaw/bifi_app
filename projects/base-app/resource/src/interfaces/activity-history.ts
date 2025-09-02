export interface activityHistory<TDocument = any> {
  _id: string;
  title: string;
  details?: string;
  performDate: Date;
  model: string;
  modelId: TDocument;
  metadata?: any;
}
