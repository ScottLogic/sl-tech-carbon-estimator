/**
 * AI Task Energy Consumption Data
 * 
 * Energy consumption data from Luccioni et al. (2024) Table 2
 * "Power Hungry Processing: Watts Driving the Cost of AI Deployment?"
 * 
 * Values represent mean energy per 1,000 inferences (kWh) and standard deviation
 * for different AI task types based on empirical measurements.
 * 
 * @see https://arxiv.org/abs/2311.16863
 */

/**
 * Raw energy data for all AI task types except mixed-usage
 * Mixed-usage is calculated dynamically as the average of all other task types
 * 
 * This is the single source of truth for AI task types and their energy data.
 * Adding a new task only requires adding it here.
 */
export const AI_TASK_ENERGY_DATA = {
  // Natural Language Processing Tasks
  'text-classification': { 
    mean: 0.002, 
    stdev: 0.001 
  },
  'extractive-qa': { 
    mean: 0.003, 
    stdev: 0.001 
  },
  'token-classification': { 
    mean: 0.004, 
    stdev: 0.002 
  },
  'text-generation': { 
    mean: 0.047, 
    stdev: 0.030 
  },
  'summarisation': { 
    mean: 0.049, 
    stdev: 0.010 
  },

  // Computer Vision Tasks
  'image-classification': { 
    mean: 0.007, 
    stdev: 0.001 
  },
  'object-detection': { 
    mean: 0.038, 
    stdev: 0.020 
  },
  'image-captioning': { 
    mean: 0.063, 
    stdev: 0.020 
  },
  'image-generation': { 
    mean: 2.907, 
    stdev: 3.310 
  },
} as const;

/**
 * Derived types and arrays from the AI task energy data
 * These are automatically generated from the data above
 */
export type AITaskTypeFromData = keyof typeof AI_TASK_ENERGY_DATA;
export const aiTaskArrayFromData = Object.keys(AI_TASK_ENERGY_DATA) as (keyof typeof AI_TASK_ENERGY_DATA)[];

// Mixed-usage is a special case calculated from other tasks
export const AI_MIXED_USAGE_TASK = 'mixed-usage' as const;
export type MixedUsageTaskType = typeof AI_MIXED_USAGE_TASK;

// Complete list including mixed-usage
export const allAiTaskArray = [...aiTaskArrayFromData, AI_MIXED_USAGE_TASK] as const;
export type AITaskType = AITaskTypeFromData | MixedUsageTaskType;

/**
 * Power Usage Effectiveness (PUE) values for AI service providers
 * Based on publicly available sustainability reports and data center efficiency metrics
 * 
 * PUE measures how efficiently a data center uses energy, with 1.0 being perfect efficiency
 * (all energy goes to computing) and higher values indicating more energy overhead.
 */
export const AI_PROVIDER_PUE_DATA: Record<string, { value: number; source: string; description: string }> = {
  'openai': {
    value: 1.12,
    source: 'Microsoft sustainability playbook',
    description: 'OpenAI API runs on Microsoft Azure (Microsoft design PUE for new builds: 1.12)'
  },
  'anthropic': {
    value: 1.15,
    source: 'AWS sustainability page reports 2024 global PUE of 1.15',
    description: 'Claude runs on AWS Bedrock (AWS global average PUE: 1.15)'
  },
  'google': {
    value: 1.09,
    source: 'Google data centres efficiency page',
    description: 'Google\'s fleet average PUE (2024)'
  },
  'microsoft': {
    value: 1.12,
    source: 'Microsoft sustainability playbook and ESG materials',
    description: 'Microsoft design PUE for new builds'
  },
  'aws': {
    value: 1.15,
    source: 'AWS sustainability page reports 2024 global PUE of 1.15',
    description: 'AWS global average PUE (2024)'
  },
  'meta': {
    value: 1.08,
    source: 'Meta\'s Environmental Data Index annual data centre PUE values',
    description: 'Meta\'s average PUE from latest detailed reporting (2022, reported steady since)'
  },
  'huggingface': {
    value: 1.15,
    source: 'Hugging Face Inference Endpoints allow cloud selection, AWS PUE used as default',
    description: 'Uses customer-selected cloud providers; defaulting to AWS average (1.15)'
  },
  'other': {
    value: 1.58,
    source: 'Uptime Institute\'s 2023 global survey shows average PUE of 1.58',
    description: 'Industry average PUE from Uptime Institute 2023 global survey'
  },
};

/**
 * Configuration metadata
 */
export const AI_ENERGY_DATA_CONFIG = {
  version: '1.0.0',
  lastUpdated: '2024-09-26',
  dataSource: 'Luccioni et al. (2024) - Power Hungry Processing: Watts Driving the Cost of AI Deployment?',
  notes: [
    'Energy values are measured in kWh per 1,000 inferences',
    'Mixed-usage values are calculated dynamically as averages of all other task types',
    'PUE values are sourced from official provider sustainability reports',
    'Data should be reviewed periodically for updates from providers'
  ]
} as const;