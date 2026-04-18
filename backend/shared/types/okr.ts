// OKR & Success Metrics types (Step 9)

export type OKRStatus = "ON_TRACK" | "AT_RISK" | "BEHIND" | "COMPLETED";
export type MetricCategory = "acquisition" | "activation" | "retention" | "revenue" | "referral";
export type MetricFrequency = "daily" | "weekly" | "monthly" | "quarterly";

export interface KeyResult {
  description: string;
  targetValue: string;
  unit: string;
  currentValue: string;
  confidence: "high" | "medium" | "low";
}

export interface OKR {
  id?: string;
  projectId?: string;
  objective: string;
  quarter: string;
  keyResults: KeyResult[];
  status: OKRStatus;
}

export interface SuccessMetric {
  category: MetricCategory;
  name: string;
  formula: string;
  target: string;
  frequency: MetricFrequency;
  dataSource: string;
}

export interface NorthStarMetric {
  name: string;
  definition: string;
  target: string;
  rationale: string;
}

// Step 9 output
export interface OKRsMetricsOutput {
  okrs: OKR[];
  successMetrics: SuccessMetric[];
  northStarMetric: NorthStarMetric;
}
