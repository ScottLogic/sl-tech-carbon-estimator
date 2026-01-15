import { inject, Injectable } from '@angular/core';
import { gCo2ePerKwh, KgCo2e } from '../../../types/units';
import { AI_PROVIDER_PUE_DATA, AI_TASK_ENERGY_DATA, AiTaskType } from '../types/ai-energy-data';
import { AiInference, AiInferenceEstimation, AiProvider, TaskEnergyConsumption } from '../types/ai-types';
import { CarbonIntensityService } from '../../../services/carbon-intensity.service';

@Injectable({ providedIn: 'root' })
export class EstimateAiEmissionsService {
  private carbonIntensityService = inject(CarbonIntensityService);

  private mixedUsageCache: { mean: number; stdev: number } | null = null;

  public estimate(formValue: AiInference): AiInferenceEstimation {
    const aiIntensity = this.carbonIntensityService.getCarbonIntensity(formValue.aiServiceLocation);
    return this.estimateAIInferenceEmissions(formValue, aiIntensity);
  }

  private estimateAIInferenceEmissions(aiInference: AiInference, carbonIntensity: gCo2ePerKwh): AiInferenceEstimation {
    if (aiInference.noAiInference) {
      return { aiInference: 0 };
    }

    const result = this.estimateAIInferenceCO2e(
      aiInference.primaryTaskType,
      aiInference.monthlyInferences,
      aiInference.aiServiceProvider,
      carbonIntensity
    );

    return { aiInference: result };
  }

  private getAIProviderPUE(provider: AiProvider): number {
    return AI_PROVIDER_PUE_DATA[provider]?.value ?? AI_PROVIDER_PUE_DATA['other'].value;
  }

  private estimateAIInferenceCO2e(
    taskType: AiTaskType,
    monthlyInferences: number,
    provider: AiProvider,
    carbonIntensity: gCo2ePerKwh
  ): KgCo2e {
    const energyData = this.getTaskEnergyConsumption(taskType);
    const pue = this.getAIProviderPUE(provider);

    const co2ePer1000Inferences: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
    const annualInferences = monthlyInferences * 12;
    return (co2ePer1000Inferences * annualInferences) / 1000;
  }

  private calculateMixedUsageValues(): { mean: number; stdev: number } {
    if (this.mixedUsageCache !== null) {
      return this.mixedUsageCache;
    }

    const tasks = Object.values(AI_TASK_ENERGY_DATA);
    const meanSum = tasks.reduce((sum, task) => sum + task.mean, 0);
    const stdevSum = tasks.reduce((sum, task) => sum + task.stdev, 0);

    this.mixedUsageCache = {
      mean: meanSum / tasks.length,
      stdev: stdevSum / tasks.length,
    };

    return this.mixedUsageCache;
  }

  private getTaskEnergyConsumption(taskType: AiTaskType): TaskEnergyConsumption {
    let data: { mean: number; stdev: number } | undefined;

    if (taskType === 'mixed-usage') {
      data = this.calculateMixedUsageValues();
    } else {
      data = AI_TASK_ENERGY_DATA[taskType];
    }

    if (!data) {
      throw new Error(
        `No energy data found for task type: "${taskType}". Available types: ${Object.keys(AI_TASK_ENERGY_DATA).join(', ')}`
      );
    }

    const lowBand = Math.max(0, data.mean - data.stdev);
    const highBand = data.mean + data.stdev;

    return {
      meanKwhPer1000Inferences: data.mean,
      lowBandKwhPer1000Inferences: lowBand,
      highBandKwhPer1000Inferences: highBand,
    };
  }
}
