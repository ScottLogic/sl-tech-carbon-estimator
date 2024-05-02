import { KgCo2e, KilowattHour } from '../types/units';
import { WorldLocation } from '../types/carbon-estimator';
import { averageIntensity } from '@tgwf/co2';

export function estimateEnergyEmissions(energy: KilowattHour, location: WorldLocation): KgCo2e {
  return (averageIntensity.data[location] * energy) / 1000;
}
