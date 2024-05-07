import { Injectable } from '@angular/core';
import { gCo2ePerKwh } from '../types/units';
import { WorldLocation } from '../types/carbon-estimator';
import { averageIntensity } from '@tgwf/co2';

@Injectable({
  providedIn: 'root',
})
export class CarbonIntensityService {
  constructor() {}

  getCarbonIntensity(location: WorldLocation): gCo2ePerKwh {
    return averageIntensity.data[location];
  }
}
