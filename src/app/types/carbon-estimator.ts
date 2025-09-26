import { FormControl, FormGroup } from '@angular/forms';
import { ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexStates, ApexTooltip } from 'ng-apexcharts';
import { KgCo2e, KilowattHour, gCo2ePerKwh } from './units';
import { AI_TASK_ENERGY_DATA, AI_PROVIDER_PUE_DATA, AITaskType, allAiTaskArray } from './ai-energy-data';

export type CarbonEstimation = {
  values: CarbonEstimationValues;
  percentages: CarbonEstimationPercentages;
};

export type CarbonEstimationPercentages = {
  version: string;
  upstreamEmissions: UpstreamEstimation;
  indirectEmissions: IndirectEstimation;
  directEmissions: DirectEstimation;
  aiInferenceEmissions: AIInferenceEstimation;
  downstreamEmissions: DownstreamEstimation;
};

export type CarbonEstimationValues = {
  version: string;
  upstreamEmissions: UpstreamEstimation;
  indirectEmissions: IndirectEstimation;
  directEmissions: DirectEstimation;
  aiInferenceEmissions: AIInferenceEstimation;
  downstreamEmissions: DownstreamEstimation;
  totalEmissions: KgCo2e;
};

export type UpstreamEstimation = {
  software: number;
  employee: number;
  network: number;
  server: number;
};
export type IndirectEstimation = {
  cloud: number;
  saas: number;
  managed: number;
};
export type DirectEstimation = {
  employee: number;
  network: number;
  server: number;
};
export type DownstreamEstimation = {
  endUser: number;
  networkTransfer: number;
  downstreamInfrastructure: number;
};
export type AIInferenceEstimation = {
  aiInference: number;
};

export type EstimatorValues = {
  upstream: Upstream;
  onPremise: OnPremise;
  cloud: Cloud;
  aiInference: AIInference;
  downstream: Downstream;
};

export type EstimatorFormValues = {
  upstream: FormGroup<{
    headCount: FormControl<number>;
    desktopPercentage: FormControl<number>;
    employeeLocation: FormControl<WorldLocation>;
  }>;
  onPremise: FormGroup<{
    estimateServerCount: FormControl<boolean>;
    serverLocation: FormControl<WorldLocation | 'unknown'>;
    numberOfServers: FormControl<number>;
  }>;
  cloud: FormGroup<{
    noCloudServices: FormControl<boolean>;
    cloudLocation: FormControl<WorldLocation | 'unknown'>;
    cloudPercentage: FormControl<number>;
    monthlyCloudBill: FormControl<CostRange>;
  }>;
  downstream: FormGroup<{
    noDownstream: FormControl<boolean>;
    customerLocation: FormControl<WorldLocation>;
    monthlyActiveUsers: FormControl<number>;
    mobilePercentage: FormControl<number>;
    purposeOfSite: FormControl<PurposeOfSite>;
  }>;
};

export type OnPremise = {
  estimateServerCount: boolean;
  serverLocation: WorldLocation;
  numberOfServers: number;
};
export type Upstream = {
  headCount: number;
  desktopPercentage: number;
  employeeLocation: WorldLocation;
};
export type Cloud = {
  noCloudServices: boolean;
  cloudLocation: WorldLocation;
  cloudPercentage: number;
  monthlyCloudBill: CostRange;
};
export type Downstream = {
  noDownstream: boolean;
  customerLocation: WorldLocation;
  monthlyActiveUsers: number;
  mobilePercentage: number;
  purposeOfSite: PurposeOfSite;
};

export type DeviceCategory = 'employee' | 'server' | 'network';

export const locationArray = [
  'WORLD',
  'GBR',
  'EUROPE',
  'NORTH AMERICA',
  'ASIA',
  'AFRICA',
  'OCEANIA',
  'LATIN AMERICA AND CARIBBEAN',
] as const;
export type WorldLocation = (typeof locationArray)[number];

export type CostRange = {
  min: number;
  max: number;
};

export const basePurposeArray = ['information', 'eCommerce', 'socialMedia', 'streaming'] as const;
export type BasePurposeOfSite = (typeof basePurposeArray)[number];

export const purposeOfSiteArray = [...basePurposeArray, 'average'] as const;
export type PurposeOfSite = (typeof purposeOfSiteArray)[number];

// AI task array is now imported from ai-energy-data.ts
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
export type AIProvider = (typeof aiProviderArray)[number];

export type AIInference = {
  noAIInference: boolean;
  primaryTaskType: AITaskType;
  monthlyInferences: number;
  aiServiceProvider: AIProvider;
  aiServiceLocation: WorldLocation;
};

export type AITaskUsage = {
  taskType: AITaskType;
  monthlyInferences: number;
};

export type AIInferenceBreakdown = {
  noAIInference: boolean;
  taskUsages: AITaskUsage[];
  aiServiceProvider: AIProvider;
  aiServiceLocation: WorldLocation;
};

export type AITaskEmissions = {
  taskType: AITaskType;
  monthlyInferences: number;
  annualEnergyKwh: number;
  co2eKg: number;
};

export type AICO2eEstimate = {
  low: KgCo2e;
  mean: KgCo2e;
  high: KgCo2e;
};

export type AITaskEmissionsRange = {
  taskType: AITaskType;
  monthlyInferences: number;
  annualEnergyKwh: number;
  co2e: AICO2eEstimate;
};

export type ChartOptions = {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  dataLabels: ApexDataLabels;
};

export type jsonExport = {
  estimate: CarbonEstimation | undefined;
  input: EstimatorValues | undefined;
}; 

export type TaskEnergyConsumption = {
  meanKwhPer1000Inferences: number;
  lowBandKwhPer1000Inferences: number;
  highBandKwhPer1000Inferences: number;
};

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
    stdev: stdevSum / tasks.length
  };
  
  return mixedUsageCache;
}

// Function to clear the mixed-usage cache (primarily for testing)
export function clearMixedUsageCache(): void {
  mixedUsageCache = null;
}

export function getTaskEnergyConsumption(taskType: AITaskType): TaskEnergyConsumption {
  let data: { mean: number; stdev: number };
  
  if (taskType === 'mixed-usage') {
    data = calculateMixedUsageValues();
  } else {
    data = AI_TASK_ENERGY_DATA[taskType];
  }
  
  const lowBand = Math.max(0, data.mean - data.stdev); // Clamp to 0 for negative values
  const highBand = data.mean + data.stdev;
  
  return {
    meanKwhPer1000Inferences: data.mean,
    lowBandKwhPer1000Inferences: lowBand,
    highBandKwhPer1000Inferences: highBand,
  };
}

export function getAIProviderPUE(provider: AIProvider): number {
  return AI_PROVIDER_PUE_DATA[provider]?.value ?? AI_PROVIDER_PUE_DATA['other'].value;
}

export function estimateAIInferenceCO2e(
  taskType: AITaskType,
  monthlyInferences: number,
  provider: AIProvider,
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
  return co2ePer1000Inferences * annualInferences / 1000;
}

export function estimateAIInferenceCO2eRange(
  taskType: AITaskType,
  monthlyInferences: number,
  provider: AIProvider,
  carbonIntensity: gCo2ePerKwh
): AICO2eEstimate {
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
    low: lowCo2ePer1000 * annualInferences / 1000,
    mean: meanCo2ePer1000 * annualInferences / 1000,
    high: highCo2ePer1000 * annualInferences / 1000,
  };
}

export function estimateMultipleAITasksCO2e(
  taskUsages: AITaskUsage[],
  provider: AIProvider,
  carbonIntensity: gCo2ePerKwh
): { taskEmissions: AITaskEmissions[]; totalCO2e: KgCo2e } {
  const pue = getAIProviderPUE(provider);
  const taskEmissions: AITaskEmissions[] = [];
  let totalCO2e: KgCo2e = 0;
  
  for (const taskUsage of taskUsages) {
    const energyData = getTaskEnergyConsumption(taskUsage.taskType);
    
    // Step 1: Calculate CO2e per 1,000 inferences
    // CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
    const co2ePer1000Inferences: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
    
    // Step 2: Scale to actual usage over the year
    // CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
    const annualInferences = taskUsage.monthlyInferences * 12;
    const co2eKg: KgCo2e = co2ePer1000Inferences * annualInferences / 1000;
    
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

export function estimateMultipleAITasksCO2eRange(
  taskUsages: AITaskUsage[],
  provider: AIProvider,
  carbonIntensity: gCo2ePerKwh
): { taskEmissions: AITaskEmissionsRange[]; totalCO2e: AICO2eEstimate } {
  const pue = getAIProviderPUE(provider);
  const taskEmissions: AITaskEmissionsRange[] = [];
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
    const lowCO2e: KgCo2e = lowCo2ePer1000 * annualInferences / 1000;
    const meanCO2e: KgCo2e = meanCo2ePer1000 * annualInferences / 1000;
    const highCO2e: KgCo2e = highCo2ePer1000 * annualInferences / 1000;
    
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
    }
  };
}

export function estimateAIInferenceEmissions(
  aiInference: AIInference,
  carbonIntensity: gCo2ePerKwh
): AIInferenceEstimation {
  if (aiInference.noAIInference) {
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