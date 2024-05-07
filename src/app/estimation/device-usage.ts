import { DeviceCategory } from '../types/carbon-estimator';
import { KgCo2e, gCo2ePerKwh } from '../types/units';
import { DeviceType } from './device-type';
import { estimateEnergyEmissions } from './estimate-energy-emissions';

export interface DeviceUsage {
  estimateUpstreamEmissions(): KgCo2e;
  estimateDirectEmissions(): KgCo2e;
  readonly category: DeviceCategory;
}

export function createDeviceUsage(
  type: DeviceType,
  category: DeviceCategory,
  intensity: gCo2ePerKwh,
  count: number,
  pue?: number
): DeviceUsage {
  const actualPue = pue ?? 1;
  return {
    category: category,
    estimateUpstreamEmissions: () => type.estimateYearlyUpstreamEmissions(count),
    estimateDirectEmissions: () => {
      const energy = type.estimateYearlyEnergy(count) * actualPue;
      return estimateEnergyEmissions(energy, intensity);
    },
  };
}
