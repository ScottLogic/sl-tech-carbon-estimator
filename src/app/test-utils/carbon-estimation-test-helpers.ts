import { CarbonEstimation, CarbonEstimationValues, CarbonEstimationPercentages, AIInferenceEstimation, UpstreamEstimation, DirectEstimation, IndirectEstimation, DownstreamEstimation } from '../types/carbon-estimator';

export const defaultAIInferenceEmissions: AIInferenceEstimation = { aiInference: 0 };

export const defaultUpstreamEmissions: UpstreamEstimation = {
  software: 0,
  employee: 0,
  network: 0,
  server: 0,
};

export const defaultDirectEmissions: DirectEstimation = {
  employee: 0,
  network: 0,
  server: 0,
};

export const defaultIndirectEmissions: IndirectEstimation = {
  cloud: 0,
  saas: 0,
  managed: 0,
};

export const defaultDownstreamEmissions: DownstreamEstimation = {
  endUser: 0,
  networkTransfer: 0,
  downstreamInfrastructure: 0,
};

export function createMockCarbonEstimationValues(overrides: Partial<CarbonEstimationValues> = {}): CarbonEstimationValues {
  return {
    version: '1.0',
    upstreamEmissions: defaultUpstreamEmissions,
    directEmissions: defaultDirectEmissions,
    indirectEmissions: defaultIndirectEmissions,
    aiInferenceEmissions: defaultAIInferenceEmissions,
    downstreamEmissions: defaultDownstreamEmissions,
    totalEmissions: 0,
    ...overrides,
  };
}

export function createMockCarbonEstimationPercentages(overrides: Partial<CarbonEstimationPercentages> = {}): CarbonEstimationPercentages {
  return {
    version: '1.0',
    upstreamEmissions: defaultUpstreamEmissions,
    directEmissions: defaultDirectEmissions,
    indirectEmissions: defaultIndirectEmissions,
    aiInferenceEmissions: defaultAIInferenceEmissions,
    downstreamEmissions: defaultDownstreamEmissions,
    ...overrides,
  };
}

export function createMockCarbonEstimation(
  valuesOverrides: Partial<CarbonEstimationValues> = {},
  percentagesOverrides: Partial<CarbonEstimationPercentages> = {}
): CarbonEstimation {
  return {
    values: createMockCarbonEstimationValues(valuesOverrides),
    percentages: createMockCarbonEstimationPercentages(percentagesOverrides),
  };
}