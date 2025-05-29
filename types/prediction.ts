export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface PredictionResponse {
  prediction: number;
  success: boolean;
}

export interface ExplanationResponse {
  explanation: {
    prediction: number;
    feature_importance: FeatureImportance[];
  };
  success: boolean;
}

export interface ChinaFormValues {
  AFP: number;
  Input: number;
  Output: number;
  Enquiry: number;
  File: number;
  Interface: number;
  Resource: number;
  Duration: number;
}

export interface DesharnaisFormValues {
  TeamExp: number;
  ManagerExp: number;
  Length: number;
  Transactions: number;
  Entities: number;
  PointsNonAjust: number;
  PointsAdjust: number;
}

export interface AlbrechtFormValues {
  Input: number;
  Output: number;
  Inquiry: number;
  File: number;
  AdjFP: number;
}

export interface CocomoFormValues {
  acap: number;
  aexp: number;
  pcap: number;
  vexp: number;
  lexp: number;
  modp: number;
  tool: number;
  sced: number;
  loc: number;
}

export type Dataset = "china" | "desharnais" | "albrecht" | "cocomo";
