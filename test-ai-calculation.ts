import { estimateAIInferenceEmissions } from './src/app/types/carbon-estimator';

// Test our AI inference calculation directly
const testAIInference = {
  noAIInference: false,
  primaryTaskType: 'text-generation' as const,
  monthlyInferences: 1000,
  aiServiceProvider: 'openai' as const,
  aiServiceLocation: 'WORLD' as const,
};

const carbonIntensity = 500; // gCO2e/kWh

const result = estimateAIInferenceEmissions(testAIInference, carbonIntensity);

console.log('AI Inference Emissions Result:', result);
console.log('CO2e value:', result.aiInference);

// Test with no AI
const noAIInference = {
  noAIInference: true,
  primaryTaskType: 'text-generation' as const,
  monthlyInferences: 0,
  aiServiceProvider: 'openai' as const,
  aiServiceLocation: 'WORLD' as const,
};

const noAIResult = estimateAIInferenceEmissions(noAIInference, carbonIntensity);
console.log('No AI Inference Result:', noAIResult);
console.log('Should be 0:', noAIResult.aiInference);

export { result, noAIResult };