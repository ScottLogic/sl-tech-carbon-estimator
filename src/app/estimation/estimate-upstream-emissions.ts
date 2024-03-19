import { DeviceCounts, UpstreamEstimation } from '../carbon-estimator';
import { desktop, laptop, network, server } from './device-type';

export function estimateUpstreamEmissions(deviceCounts: DeviceCounts): UpstreamEstimation {
  const desktopUpstreamEmissions = desktop.estimateYearlyUpstreamEmissions(deviceCounts.desktopCount);
  const laptopUpstreamEmissions = laptop.estimateYearlyUpstreamEmissions(deviceCounts.laptopCount);
  const serverUpstreamEmissions = server.estimateYearlyUpstreamEmissions(deviceCounts.serverCount);
  const networkUpstreamEmissions = network.estimateYearlyUpstreamEmissions(deviceCounts.networkCount);

  return {
    software: 0,
    user: desktopUpstreamEmissions + laptopUpstreamEmissions,
    server: serverUpstreamEmissions,
    network: networkUpstreamEmissions,
  };
}
