import { inject, Injectable } from '@angular/core';
import { gCo2ePerKwh, KgCo2e } from '../../../types/units';
import { AI_PROVIDER_PUE_DATA, AI_TASK_ENERGY_DATA, AiTaskType } from '../types/ai-energy-data';
import {
  // AiCo2eEstimate,
  AiInference,
  AiInferenceEstimation,
  AiProvider,
  // AiTaskEmissions,
  // AiTaskEmissionsRange,
  // AiTaskUsage,
  TaskEnergyConsumption,
} from '../types/ai-types';
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

  // public estimateAIInferenceCO2eRange(
  //   taskType: AiTaskType,
  //   monthlyInferences: number,
  //   provider: AiProvider,
  //   carbonIntensity: gCo2ePerKwh
  // ): AiCo2eEstimate {
  //   const energyData = this.getTaskEnergyConsumption(taskType);
  //   const pue = this.getAIProviderPUE(provider);
  //   const annualInferences = monthlyInferences * 12;

  //   const lowCo2ePer1000: KgCo2e = energyData.lowBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  //   const meanCo2ePer1000: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  //   const highCo2ePer1000: KgCo2e = energyData.highBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);

  //   return {
  //     low: (lowCo2ePer1000 * annualInferences) / 1000,
  //     mean: (meanCo2ePer1000 * annualInferences) / 1000,
  //     high: (highCo2ePer1000 * annualInferences) / 1000,
  //   };
  // }

  // public estimateMultipleAITasksCO2e(
  //   taskUsages: AiTaskUsage[],
  //   provider: AiProvider,
  //   carbonIntensity: gCo2ePerKwh
  // ): { taskEmissions: AiTaskEmissions[]; totalCO2e: KgCo2e } {
  //   const pue = this.getAIProviderPUE(provider);
  //   const taskEmissions: AiTaskEmissions[] = [];
  //   let totalCO2e: KgCo2e = 0;

  //   for (const taskUsage of taskUsages) {
  //     const energyData = this.getTaskEnergyConsumption(taskUsage.taskType);
  //     const co2ePer1000Inferences: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  //     const annualInferences = taskUsage.monthlyInferences * 12;
  //     const co2eKg: KgCo2e = (co2ePer1000Inferences * annualInferences) / 1000;

  //     const annualEnergyKwh: KilowattHour = (energyData.meanKwhPer1000Inferences * annualInferences * pue) / 1000;

  //     taskEmissions.push({
  //       taskType: taskUsage.taskType,
  //       monthlyInferences: taskUsage.monthlyInferences,
  //       annualEnergyKwh: annualEnergyKwh,
  //       co2eKg: co2eKg,
  //     });

  //     totalCO2e += co2eKg;
  //   }

  //   return { taskEmissions, totalCO2e };
  // }

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

  // Function to clear the mixed-usage cache (primarily for testing)
  // public clearMixedUsageCache(): void {
  //   this.mixedUsageCache = null;
  // }

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

  // public estimateMultipleAITasksCO2eRange(
  //   taskUsages: AiTaskUsage[],
  //   provider: AiProvider,
  //   carbonIntensity: gCo2ePerKwh
  // ): { taskEmissions: AiTaskEmissionsRange[]; totalCO2e: AiCo2eEstimate } {
  //   const pue = this.getAIProviderPUE(provider);
  //   const taskEmissions: AiTaskEmissionsRange[] = [];
  //   let totalLowCO2e: KgCo2e = 0;
  //   let totalMeanCO2e: KgCo2e = 0;
  //   let totalHighCO2e: KgCo2e = 0;

  //   for (const taskUsage of taskUsages) {
  //     const energyData = this.getTaskEnergyConsumption(taskUsage.taskType);
  //     const annualInferences = taskUsage.monthlyInferences * 12;

  //     const lowCo2ePer1000: KgCo2e = energyData.lowBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  //     const meanCo2ePer1000: KgCo2e = energyData.meanKwhPer1000Inferences * pue * (carbonIntensity / 1000);
  //     const highCo2ePer1000: KgCo2e = energyData.highBandKwhPer1000Inferences * pue * (carbonIntensity / 1000);

  //     const lowCO2e: KgCo2e = (lowCo2ePer1000 * annualInferences) / 1000;
  //     const meanCO2e: KgCo2e = (meanCo2ePer1000 * annualInferences) / 1000;
  //     const highCO2e: KgCo2e = (highCo2ePer1000 * annualInferences) / 1000;

  //     const annualEnergyKwh: KilowattHour = (energyData.meanKwhPer1000Inferences * annualInferences * pue) / 1000;

  //     taskEmissions.push({
  //       taskType: taskUsage.taskType,
  //       monthlyInferences: taskUsage.monthlyInferences,
  //       annualEnergyKwh: annualEnergyKwh,
  //       co2e: {
  //         low: lowCO2e,
  //         mean: meanCO2e,
  //         high: highCO2e,
  //       },
  //     });

  //     totalLowCO2e += lowCO2e;
  //     totalMeanCO2e += meanCO2e;
  //     totalHighCO2e += highCO2e;
  //   }

  //   return {
  //     taskEmissions,
  //     totalCO2e: {
  //       low: totalLowCO2e,
  //       mean: totalMeanCO2e,
  //       high: totalHighCO2e,
  //     },
  //   };
  // }
}
