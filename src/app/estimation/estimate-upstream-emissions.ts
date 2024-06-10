import { DeviceCategory, UpstreamEstimation } from '../types/carbon-estimator';
import { DeviceUsage } from './device-usage';

export function estimateUpstreamEmissions(deviceUsage: DeviceUsage[]): UpstreamEstimation {
  const result: Record<DeviceCategory, number> = {
    employee: 0,
    server: 0,
    network: 0,
  };
  for (const usage of deviceUsage) {
    result[usage.category] += usage.estimateUpstreamEmissions();
  }
  return {
    ...result,
    software: 0,
  };
}
