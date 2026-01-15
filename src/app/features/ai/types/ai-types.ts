import { WorldLocation } from '../../../types/carbon-estimator';
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
