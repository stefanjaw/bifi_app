export interface promptVersion {
  _id?: string;
  name?: string;
  prompt?: string;
  version?: number;
}

export interface aiSettings {
  _id?: string;
  aiProvider?: string;
  apiKey?: string;
  model?: string;
  embeddingModel?: string;
  maxTokenLimit?: number;
  promptVersions?: promptVersion[];
}
