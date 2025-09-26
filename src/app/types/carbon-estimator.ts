import { FormControl, FormGroup } from '@angular/forms';
import { ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexStates, ApexTooltip } from 'ng-apexcharts';
import { KgCo2e, KilowattHour, gCo2ePerKwh } from './units';

export type CarbonEstimation = {
  values: CarbonEstimationValues;
  percentages: CarbonEstimationPercentages;
};

export type CarbonEstimationPercentages = {
  version: string;
  upstreamEmissions: UpstreamEstimation;
  indirectEmissions: IndirectEstimation;
  directEmissions: DirectEstimation;
  downstreamEmissions: DownstreamEstimation;
};

export type CarbonEstimationValues = {
  version: string;
  upstreamEmissions: UpstreamEstimation;
  indirectEmissions: IndirectEstimation;
  directEmissions: DirectEstimation;
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

// AI Inference types for research-based estimation
export const aiTaskArray = [
  'text-generation',
  'summarisation',
  'extractive-qa', 
  'text-classification',
  'token-classification',
  'image-classification',
  'image-captioning',
  'object-detection',
  'image-generation',
  'mixed-usage',
] as const;
export type AITaskType = (typeof aiTaskArray)[number];

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

// Energy consumption data from Luccioni et al. (2024) Table 2
// Mean energy per 1,000 inferences (kWh) and standard deviation
const taskEnergyData: Record<Exclude<AITaskType, 'mixed-usage'>, { mean: number; stdev: number }> = {
  'text-classification': { mean: 0.002, stdev: 0.001 },
  'extractive-qa': { mean: 0.003, stdev: 0.001 },
  'token-classification': { mean: 0.004, stdev: 0.002 },
  'image-classification': { mean: 0.007, stdev: 0.001 },
  'object-detection': { mean: 0.038, stdev: 0.020 },
  'text-generation': { mean: 0.047, stdev: 0.030 },
  'summarisation': { mean: 0.049, stdev: 0.010 },
  'image-captioning': { mean: 0.063, stdev: 0.020 },
  'image-generation': { mean: 2.907, stdev: 3.310 },
};

// Cache for mixed-usage values to avoid recalculation
let mixedUsageCache: { mean: number; stdev: number } | null = null;

// Calculate mixed-usage values as the average of all other task types
function calculateMixedUsageValues(): { mean: number; stdev: number } {
  if (mixedUsageCache !== null) {
    return mixedUsageCache;
  }

  const tasks = Object.values(taskEnergyData);
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
    data = taskEnergyData[taskType];
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
  // Power Usage Effectiveness (PUE) values for AI service providers
  // Based on publicly available sustainability reports and data center efficiency metrics
  const AI_INFERENCE_PUE: Record<AIProvider, number> = {
    'openai': 1.12,      // OpenAI API runs on Microsoft Azure (Microsoft design PUE for new builds: 1.12)
                         // Source: Microsoft sustainability playbook - new datacentres designed to 1.12 PUE
                         // https://blogs.microsoft.com/blog/2025/01/21/microsoft-and-openai-evolve-partnership-to-drive-the-next-phase-of-ai/?utm_source=chatgpt.com
    'anthropic': 1.15,   // Claude runs on AWS Bedrock (AWS global average PUE: 1.15) 
                         // Source: AWS sustainability page reports 2024 global PUE of 1.15
                         // https://aws.amazon.com/blogs/aws/claude-opus-4-anthropics-most-powerful-model-for-coding-is-now-in-amazon-bedrock/?utm_source=chatgpt.com
    'google': 1.09,      // Google's fleet average PUE (2024)
                         // Source: Google data centres efficiency page
    'microsoft': 1.12,   // Microsoft design PUE for new builds
                         // https://datacenters.google/efficiency?utm_source=chatgpt.com
                         // Source: Microsoft sustainability playbook and ESG materials
    'aws': 1.15,         // AWS global average PUE (2024)
                         // Source: AWS sustainability page reports 2024 global PUE of 1.15
                         // https://aws.amazon.com/sustainability/data-centers/?utm_source=chatgpt.com
    'meta': 1.08,        // Meta's average PUE from latest detailed reporting (2022, reported steady since)
                         // Source: Meta's Environmental Data Index annual data centre PUE values
                         // https://sustainability.fb.com/wp-content/uploads/2023/07/Meta-2023-Environmental-Data-Index.pdf
    'huggingface': 1.15, // Uses customer-selected cloud providers; defaulting to AWS average (1.15)
                         // Source: Hugging Face Inference Endpoints allow cloud selection, AWS PUE used as default
                         // https://huggingface.co/inference-endpoints/dedicated?utm_source=chatgpt.com
    'other': 1.58,       // Industry average PUE from Uptime Institute 2023 global survey
                         // Source: Uptime Institute's 2023 global survey shows average PUE of 1.58
                         // https://journal.uptimeinstitute.com/large-data-centers-are-mostly-more-efficient-analysis-confirms/?utm_source=chatgpt.com
  };
  
  return AI_INFERENCE_PUE[provider];
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