import { KgCo2e, KgCo2ePerKwh, KilowattHour, gCo2ePerKwh } from '../types/units';
import { WorldLocation } from '../types/carbon-estimator';

// Carbon Intensity figures sourced from https://ember-climate.org/data/data-tools/data-explorer/
export const locationIntensityMap: Record<WorldLocation, KgCo2ePerKwh> = {
  global: 0.494,
  us: 0.41,
  eu: 0.33,
  uk: 0.238,
};

export function estimateEnergyEmissions(energy: KilowattHour, location: WorldLocation): KgCo2e {
  return locationIntensityMap[location] * energy;
}

export function getCarbonIntensity(location: WorldLocation): gCo2ePerKwh {
  return locationIntensityMap[location] * 1000;
}
