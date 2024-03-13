import { DeviceCounts } from '../carbon-estimator';
import { KgCo2e } from '../types/units';
import { desktop, laptop, network, server } from './device-type';

export function estimateUpstreamEmissions(deviceCounts: DeviceCounts): KgCo2e {
  const desktopUpstreamEmissions = desktop.estimateYearlyUpstreamEmissions(deviceCounts.desktopCount);
  const laptopUpstreamEmissions = laptop.estimateYearlyUpstreamEmissions(deviceCounts.laptopCount);
  const serverUpstreamEmissions = server.estimateYearlyUpstreamEmissions(deviceCounts.serverCount);
  const networkUpstreamEmissions = network.estimateYearlyUpstreamEmissions(deviceCounts.networkCount);

  return desktopUpstreamEmissions + laptopUpstreamEmissions + serverUpstreamEmissions + networkUpstreamEmissions;
}
