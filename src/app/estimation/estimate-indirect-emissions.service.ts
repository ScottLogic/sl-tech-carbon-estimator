import { inject, Injectable } from '@angular/core';
import { CostRange, EstimatorValues, IndirectEstimation } from '../types/carbon-estimator';
import { gCo2ePerKwh, KgCo2e, KilowattHour } from '../types/units';
import { CLOUD_AVERAGE_PUE } from './constants';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { CarbonIntensityService } from '../services/carbon-intensity.service';

@Injectable({
  providedIn: 'root',
})
export class EstimateIndirectEmissionsService {
  // Calculated in spreadsheet, explained in assumptions-and-limitation component
  private carbonIntensityService = inject(CarbonIntensityService);

  private COST_TO_KWH_RATIO = 0.156;
  private COST_TO_UPSTREAM_RATIO = 0.0164;

  public estimateIndirectEmissions(formValue: EstimatorValues): IndirectEstimation {
    const cloudIntensity = this.carbonIntensityService.getCarbonIntensity(formValue.cloud.cloudLocation);
    const cloud =
      formValue.cloud.noCloudServices ?
        0
      : this.estimateTotalCloudEmissions(formValue.cloud.monthlyCloudBill, cloudIntensity);

    return { cloud, saas: 0, managed: 0 };
  }

  estimateTotalCloudEmissions(monthlyCloudBill: CostRange, cloudIntensity: gCo2ePerKwh): KgCo2e {
    const midpoint = (monthlyCloudBill.min + monthlyCloudBill.max) / 2;
    const cloudEnergy = this.estimateCloudEnergy(midpoint);
    const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, cloudIntensity);
    const cloudUpstreamEmissions = this.estimateCloudUpstream(midpoint);
    return cloudDirectEmissions + cloudUpstreamEmissions;
  }

  estimateCloudEnergy(monthlyCloudBill: number): KilowattHour {
    return monthlyCloudBill * this.COST_TO_KWH_RATIO * CLOUD_AVERAGE_PUE * 12;
  }

  estimateCloudUpstream(monthlyCloudBill: number): KgCo2e {
    return monthlyCloudBill * this.COST_TO_UPSTREAM_RATIO * 12;
  }
}
