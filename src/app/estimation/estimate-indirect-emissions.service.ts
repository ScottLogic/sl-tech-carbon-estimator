import { inject, Injectable } from '@angular/core';
import { EstimatorValues, IndirectEstimation } from '../types/carbon-estimator';
import { EstimateCloudEmissionsService } from '../features/cloud/services/estimate-cloud-emissions.service';

@Injectable({
  providedIn: 'root',
})
export class EstimateIndirectEmissionsService {
  private estimateCloudEmissionsService = inject(EstimateCloudEmissionsService);

  public estimateIndirectEmissions(formValue: EstimatorValues): IndirectEstimation {
    const cloud = this.estimateCloudEmissionsService.estimateEmissions(formValue.cloud);

    return { cloud, saas: 0, managed: 0 };
  }
}
