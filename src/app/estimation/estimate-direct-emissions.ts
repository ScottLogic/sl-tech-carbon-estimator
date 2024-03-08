import { DeviceCounts, Location } from '../carbon-estimator';
import { desktop, laptop, network, server } from './device-type';
import { estimateEnergyEmissions as estimateEnergyEmissions } from './estimate-energy-emissions';

export function estimateDirectEmissions(deviceCounts: DeviceCounts, onPremLocation: Location) {
  const desktopEnergy = desktop.estimateYearlyEnergy(deviceCounts.desktopCount);
  const laptopEnergy = laptop.estimateYearlyEnergy(deviceCounts.laptopCount);
  const serverEnergy = server.estimateYearlyEnergy(deviceCounts.serverCount);
  const networkEnergy = network.estimateYearlyEnergy(deviceCounts.networkCount);

  const desktopDirectEmissions = estimateEnergyEmissions(desktopEnergy, onPremLocation);
  const laptopDirectEmissions = estimateEnergyEmissions(laptopEnergy, onPremLocation);
  const serverDirectEmissions = estimateEnergyEmissions(serverEnergy, onPremLocation);
  const networkDirectEmissions = estimateEnergyEmissions(networkEnergy, onPremLocation);

  return desktopDirectEmissions + laptopDirectEmissions + serverDirectEmissions + networkDirectEmissions;
}
