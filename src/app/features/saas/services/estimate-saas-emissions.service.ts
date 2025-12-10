import { inject, Injectable } from '@angular/core';
import { Saas } from '../components/saas.constants';
import { Microsoft365Service } from './microsoft365.service';
import { KgCo2e } from '../../../types/units';

@Injectable({
  providedIn: 'root',
})
export class EstimateSaasEmissionsService {
  private microsoft365Service = inject(Microsoft365Service);

  public estimateEmissions(values: Saas): KgCo2e {
    return this.microsoft365Service.calculateEmissions(values.microsoft365);
  }
}
