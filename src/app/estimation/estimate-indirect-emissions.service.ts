import { inject, Injectable } from '@angular/core';
import { EstimatorValues, IndirectEstimation } from '../types/carbon-estimator';
import { EstimateCloudEmissionsService } from '../features/cloud/services/estimate-cloud-emissions.service';
import { EstimateSaasEmissionsService } from '../features/saas/services/estimate-saas-emissions.service';

@Injectable({
  providedIn: 'root',
})
export class EstimateIndirectEmissionsService {
  private estimateCloudEmissionsService = inject(EstimateCloudEmissionsService);
  private estimateSaasEmissionsService = inject(EstimateSaasEmissionsService);

  public estimateIndirectEmissions(formValue: EstimatorValues): IndirectEstimation {
    const cloud = this.estimateCloudEmissionsService.estimateEmissions(formValue.cloud);
    const saas = this.estimateSaasEmissionsService.estimateEmissions(formValue.saas);
    return { cloud, saas, managed: 0 };
  }
}
