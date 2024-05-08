import { KgCo2e, KilowattHour, gCo2ePerKwh } from '../types/units';

export function estimateEnergyEmissions(energy: KilowattHour, intensity: gCo2ePerKwh): KgCo2e {
  return (intensity * energy) / 1000;
}
