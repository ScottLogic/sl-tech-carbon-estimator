import { gCo2ePerKwh, KgCo2e, KilowattHour } from '../../../types/units';
import { AI_PROVIDER_PUE_DATA, AI_TASK_ENERGY_DATA, AiTaskType } from '../types/ai-energy-data';
import {
  AiCo2eEstimate,
  AiInference,
  AiInferenceEstimation,
  AiProvider,
  AiTaskEmissions,
  AiTaskEmissionsRange,
  AiTaskUsage,
  TaskEnergyConsumption,
} from '../types/ai-types';

export function getAIProviderPUE(provider: AiProvider): number {
  return AI_PROVIDER_PUE_DATA[provider]?.value ?? AI_PROVIDER_PUE_DATA['other'].value;
}

export function estimateAIInferenceCO2e(
  taskType: AiTaskType,
  monthlyInferences: number,
  provider: AiProvider,
  carbonIntensity: gCo2ePerKwh
): KgCo2e {
  const energyData = getTaskEnergyConsumption(taskType);
  const pue = getAIProviderPUE(provider);

  // Step 1: Calculate CO2e per 1,000 inferences
  // CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
  const co2ePer1000Inferences: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);

  // Step 2: Scale to actual usage over the year
  // CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
  const annualInferences = monthlyInferences * 12;
  return (co2ePer1000Inferences * annualInferences) / 1000;
}

export function estimateAIInferenceCO2eRange(
  taskType: AiTaskType,
  monthlyInferences: number,
  provider: AiProvider,
  carbonIntensity: gCo2ePerKwh
): AiCo2eEstimate {
  const energyData = getTaskEnergyConsumption(taskType);
  const pue = getAIProviderPUE(provider);
  const annualInferences = monthlyInferences * 12;

  // Step 1: Calculate CO2e per 1,000 inferences for low, mean, and high energy values
  // CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
  const lowCo2ePer1000: KgCo2e = energyData.lowBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  const meanCo2ePer1000: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  const highCo2ePer1000: KgCo2e = energyData.highBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);

  // Step 2: Scale to actual usage over the year
  // CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
  return {
    low: (lowCo2ePer1000 * annualInferences) / 1000,
    mean: (meanCo2ePer1000 * annualInferences) / 1000,
    high: (highCo2ePer1000 * annualInferences) / 1000,
  };
}

export function estimateMultipleAITasksCO2e(
  taskUsages: AiTaskUsage[],
  provider: AiProvider,
  carbonIntensity: gCo2ePerKwh
): { taskEmissions: AiTaskEmissions[]; totalCO2e: KgCo2e } {
  const pue = getAIProviderPUE(provider);
  const taskEmissions: AiTaskEmissions[] = [];
  let totalCO2e: KgCo2e = 0;

  for (const taskUsage of taskUsages) {
    const energyData = getTaskEnergyConsumption(taskUsage.taskType);

    // Step 1: Calculate CO2e per 1,000 inferences
    // CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
    const co2ePer1000Inferences: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);

    // Step 2: Scale to actual usage over the year
    // CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
    const annualInferences = taskUsage.monthlyInferences * 12;
    const co2eKg: KgCo2e = (co2ePer1000Inferences * annualInferences) / 1000;

    // Calculate total annual energy for reporting
    const annualEnergyKwh: KilowattHour = (energyData.meanKwhPer1000Inferences * annualInferences * pue) / 1000;

    taskEmissions.push({
      taskType: taskUsage.taskType,
      monthlyInferences: taskUsage.monthlyInferences,
      annualEnergyKwh: annualEnergyKwh,
      co2eKg: co2eKg,
    });

    totalCO2e += co2eKg;
  }

  return { taskEmissions, totalCO2e };
}

// Cache for mixed-usage values to avoid recalculation
let mixedUsageCache: { mean: number; stdev: number } | null = null;

// Calculate mixed-usage values as the average of all other task types
function calculateMixedUsageValues(): { mean: number; stdev: number } {
  if (mixedUsageCache !== null) {
    return mixedUsageCache;
  }

  const tasks = Object.values(AI_TASK_ENERGY_DATA);
  const meanSum = tasks.reduce((sum, task) => sum + task.mean, 0);
  const stdevSum = tasks.reduce((sum, task) => sum + task.stdev, 0);

  mixedUsageCache = {
    mean: meanSum / tasks.length,
    stdev: stdevSum / tasks.length,
  };

  return mixedUsageCache;
}

// Function to clear the mixed-usage cache (primarily for testing)
export function clearMixedUsageCache(): void {
  mixedUsageCache = null;
}

export function getTaskEnergyConsumption(taskType: AiTaskType): TaskEnergyConsumption {
  let data: { mean: number; stdev: number };

  if (taskType === 'mixed-usage') {
    data = calculateMixedUsageValues();
  } else {
    data = AI_TASK_ENERGY_DATA[taskType];
  }

  if (!data) {
    throw new Error(
      `No energy data found for task type: "${taskType}". Available types: ${Object.keys(AI_TASK_ENERGY_DATA).join(', ')}`
    );
  }

  const lowBand = Math.max(0, data.mean - data.stdev); // Clamp to 0 for negative values
  const highBand = data.mean + data.stdev;

  return {
    meanKwhPer1000Inferences: data.mean,
    lowBandKwhPer1000Inferences: lowBand,
    highBandKwhPer1000Inferences: highBand,
  };
}

export function estimateMultipleAITasksCO2eRange(
  taskUsages: AiTaskUsage[],
  provider: AiProvider,
  carbonIntensity: gCo2ePerKwh
): { taskEmissions: AiTaskEmissionsRange[]; totalCO2e: AiCo2eEstimate } {
  const pue = getAIProviderPUE(provider);
  const taskEmissions: AiTaskEmissionsRange[] = [];
  let totalLowCO2e: KgCo2e = 0;
  let totalMeanCO2e: KgCo2e = 0;
  let totalHighCO2e: KgCo2e = 0;

  for (const taskUsage of taskUsages) {
    const energyData = getTaskEnergyConsumption(taskUsage.taskType);
    const annualInferences = taskUsage.monthlyInferences * 12;

    // Step 1: Calculate CO2e per 1,000 inferences for low, mean, and high energy values
    // CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
    const lowCo2ePer1000: KgCo2e = energyData.lowBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);
    const meanCo2ePer1000: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
    const highCo2ePer1000: KgCo2e = energyData.highBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);

    // Step 2: Scale to actual usage over the year
    // CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
    const lowCO2e: KgCo2e = (lowCo2ePer1000 * annualInferences) / 1000;
    const meanCO2e: KgCo2e = (meanCo2ePer1000 * annualInferences) / 1000;
    const highCO2e: KgCo2e = (highCo2ePer1000 * annualInferences) / 1000;

    // Calculate total annual energy for reporting (using mean values)
    const annualEnergyKwh: KilowattHour = (energyData.meanKwhPer1000Inferences * annualInferences * pue) / 1000;

    taskEmissions.push({
      taskType: taskUsage.taskType,
      monthlyInferences: taskUsage.monthlyInferences,
      annualEnergyKwh: annualEnergyKwh,
      co2e: {
        low: lowCO2e,
        mean: meanCO2e,
        high: highCO2e,
      },
    });

    totalLowCO2e += lowCO2e;
    totalMeanCO2e += meanCO2e;
    totalHighCO2e += highCO2e;
  }

  return {
    taskEmissions,
    totalCO2e: {
      low: totalLowCO2e,
      mean: totalMeanCO2e,
      high: totalHighCO2e,
    },
  };
}

export function estimateAIInferenceEmissions(
  aiInference: AiInference,
  carbonIntensity: gCo2ePerKwh
): AiInferenceEstimation {
  if (aiInference.noAiInference) {
    return { aiInference: 0 };
  }

  // For the simple case (single task type), use the direct function
  const result = estimateAIInferenceCO2e(
    aiInference.primaryTaskType,
    aiInference.monthlyInferences,
    aiInference.aiServiceProvider,
    carbonIntensity
  );

  return { aiInference: result };
}
