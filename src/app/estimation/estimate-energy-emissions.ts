import { KgCo2e, KgCo2ePerKwh, KilowattHour } from '../types/units';
import { Location } from '../carbon-estimator';

// Carbon Intensity figures sourced from https://ember-climate.org/data/data-tools/data-explorer/
const location_intensity_map: Record<Location, KgCo2ePerKwh> = {
  global: 0.494,
  us: 0.41,
  eu: 0.33,
  uk: 0.238,
};

export function estimateEnergyEmissions(energy: KilowattHour, location: Location): KgCo2e {
  return location_intensity_map[location] * energy;
}
