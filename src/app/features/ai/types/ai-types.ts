import { WorldLocation } from '../../../types/carbon-estimator';
import { KgCo2e } from '../../../types/units';
import { AiTaskType as AiTaskType, allAiTaskArray } from './ai-energy-data';

export const aiTaskArray = allAiTaskArray;

export const aiProviderArray = [
  'openai',
  'anthropic',
  'google',
  'microsoft',
  'aws',
  'meta',
  'huggingface',
  'other',
] as const;
export type AiProvider = (typeof aiProviderArray)[number];

export type TaskEnergyConsumption = {
  meanKwhPer1000Inferences: number;
  lowBandKwhPer1000Inferences: number;
  highBandKwhPer1000Inferences: number;
};

export type AiInference = {
  noAiInference: boolean;
  primaryTaskType: AiTaskType;
  monthlyInferences: number;
  aiServiceProvider: AiProvider;
  aiServiceLocation: WorldLocation;
};

export type AiInferenceEstimation = {
  aiInference: number;
};

export type AiTaskUsage = {
  taskType: AiTaskType;
  monthlyInferences: number;
};

export type AiInferenceBreakdown = {
  noAIInference: boolean;
  taskUsages: AiTaskUsage[];
  aiServiceProvider: AiProvider;
  aiServiceLocation: WorldLocation;
};

export type AiTaskEmissions = {
  taskType: AiTaskType;
  monthlyInferences: number;
  annualEnergyKwh: number;
  co2eKg: number;
};

export type AiCo2eEstimate = {
  low: KgCo2e;
  mean: KgCo2e;
  high: KgCo2e;
};

export type AiTaskEmissionsRange = {
  taskType: AiTaskType;
  monthlyInferences: number;
  annualEnergyKwh: number;
  co2e: AiCo2eEstimate;
};
