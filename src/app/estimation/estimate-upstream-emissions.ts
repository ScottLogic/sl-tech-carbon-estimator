import { DeviceCounts } from '../carbon-estimator';
import { desktop, laptop, network, server } from './device-type';

export function estimateUpstreamEmissions(deviceCounts: DeviceCounts) {
  const desktopUpstreamEmissions = desktop.estimateYearlyUpstreamEmissions(deviceCounts.desktopCount);
  const laptopUpstreamEmissions = laptop.estimateYearlyUpstreamEmissions(deviceCounts.laptopCount);
  const serverUpstreamEmissions = server.estimateYearlyUpstreamEmissions(deviceCounts.serverCount);
  const networkUpstreamEmissions = network.estimateYearlyUpstreamEmissions(deviceCounts.networkCount);

  return desktopUpstreamEmissions + laptopUpstreamEmissions + serverUpstreamEmissions + networkUpstreamEmissions;
}
