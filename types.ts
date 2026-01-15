
export enum AppStep {
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  PREPROCESS = 'PREPROCESS',
  TRAIN = 'TRAIN',
  EVALUATE = 'EVALUATE',
  DEPLOY = 'DEPLOY'
}

export interface Transaction {
  [key: string]: any;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
}

export interface ModelConfig {
  algorithm: 'XGBoost' | 'RandomForest' | 'LogisticRegression' | 'NeuralNetwork';
  testSize: number;
  learningRate: number;
  epochs?: number;
}

export interface ModelDeployment {
  endpoint: string;
  status: 'active' | 'inactive' | 'deploying';
  createdAt: string;
  version: string;
}

export type FeedbackCategory = 'General' | 'Bug Report' | 'Feature Request';

export interface FeedbackData {
  category: FeedbackCategory;
  message: string;
  email?: string;
}
