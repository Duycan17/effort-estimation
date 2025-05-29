export type CocomoInputs = {
  loc?: string;
  acap?: number;
  aexp?: number;
  lexp?: number;
  modp?: number;
  pcap?: number;
  sced?: number;
  tool?: number;
  vexp?: number;
};

export type AlbrechtInputs = {
  AdjFP?: number;
  Input?: number;
  Output?: number;
  Inquiry?: number;
  File?: number;
};

export interface ChinaInputs {
  AFP?: number;
  Input?: number;
  Output?: number;
  Enquiry?: number;
  File?: number;
  Interface?: number;
  Duration?: number;
  Resource?: number;
}

export interface DesharnaisInputs {
  Length?: number;
  TeamExp?: number;
  Entities?: number;
  ManagerExp?: number;
  PointsAdjust?: number;
  Transactions?: number;
  PointsNonAjust?: number;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  dataset: "cocomo" | "albrecht" | "china" | "desharnais";
  input_values: CocomoInputs | AlbrechtInputs | ChinaInputs | DesharnaisInputs;
  predicted_effort: number;
  actual_effort: number | null;
  feedback_rating: number | null;
  feedback_comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface FormValues {
  afp: number;
  input: number;
  output: number;
  enquiry: number;
  file: number;
  interface: number;
  resource: number;
  duration: number;
}

export interface PredictionData {
  prediction: number;
  feature_importance: Array<{
    feature: string;
    importance: number;
  }>;
}
