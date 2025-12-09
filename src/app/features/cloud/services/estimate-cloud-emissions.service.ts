import { inject, Injectable } from '@angular/core';
import { Cloud, CostRange } from '../../../types/carbon-estimator';
import { gCo2ePerKwh, KgCo2e, KilowattHour } from '../../../types/units';
import { CLOUD_AVERAGE_PUE } from '../../../estimation/constants';
import { estimateEnergyEmissions } from '../../../estimation/estimate-energy-emissions';
import { CarbonIntensityService } from '../../../services/carbon-intensity.service';

@Injectable({
  providedIn: 'root',
})
export class EstimateCloudEmissionsService {
  // Calculated in spreadsheet, explained in assumptions-and-limitation component
  private carbonIntensityService = inject(CarbonIntensityService);

  private COST_TO_KWH_RATIO = 0.156;
  private COST_TO_UPSTREAM_RATIO = 0.0164;

  public estimateEmissions(cloudValue: Cloud): number {
    if (cloudValue.noCloudServices) {
      return 0;
    }

    const cloudIntensity = this.carbonIntensityService.getCarbonIntensity(cloudValue.cloudLocation);
    return this.estimateTotalCloudEmissions(cloudValue.monthlyCloudBill, cloudIntensity);
  }

  private estimateTotalCloudEmissions(monthlyCloudBill: CostRange, cloudIntensity: gCo2ePerKwh): KgCo2e {
    const midpoint = (monthlyCloudBill.min + monthlyCloudBill.max) / 2;
    const cloudEnergy = this.estimateCloudEnergy(midpoint);
    const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, cloudIntensity);
    const cloudUpstreamEmissions = this.estimateCloudUpstream(midpoint);
    return cloudDirectEmissions + cloudUpstreamEmissions;
  }

  private estimateCloudEnergy(monthlyCloudBill: number): KilowattHour {
    return monthlyCloudBill * this.COST_TO_KWH_RATIO * CLOUD_AVERAGE_PUE * 12;
  }

  private estimateCloudUpstream(monthlyCloudBill: number): KgCo2e {
    return monthlyCloudBill * this.COST_TO_UPSTREAM_RATIO * 12;
  }
}
