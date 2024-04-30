import { DeviceCategory, DirectEstimation } from '../types/carbon-estimator';
import { DeviceUsage } from './device-usage';

export function estimateDirectEmissions(deviceUsage: DeviceUsage[]): DirectEstimation {
  const result: Record<DeviceCategory, number> = {
    user: 0,
    server: 0,
    network: 0,
  };

  for (const usage of deviceUsage) {
    result[usage.category] += usage.estimateDirectEmissions();
  }

  return result;
}
