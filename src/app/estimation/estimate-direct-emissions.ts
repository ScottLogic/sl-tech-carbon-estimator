import { DeviceCounts, DirectEstimation, WorldLocation } from '../carbon-estimator';
import { ON_PREMISE_AVERAGE_PUE } from './constants';
import { desktop, laptop, network, server } from './device-type';
import { estimateEnergyEmissions } from './estimate-energy-emissions';

export function estimateDirectEmissions(deviceCounts: DeviceCounts, onPremLocation: WorldLocation): DirectEstimation {
  const desktopEnergy = desktop.estimateYearlyEnergy(deviceCounts.desktopCount);
  const laptopEnergy = laptop.estimateYearlyEnergy(deviceCounts.laptopCount);
  const serverEnergy = server.estimateYearlyEnergy(deviceCounts.serverCount) * ON_PREMISE_AVERAGE_PUE;
  const networkEnergy = network.estimateYearlyEnergy(deviceCounts.networkCount) * ON_PREMISE_AVERAGE_PUE;

  const desktopDirectEmissions = estimateEnergyEmissions(desktopEnergy, onPremLocation);
  const laptopDirectEmissions = estimateEnergyEmissions(laptopEnergy, onPremLocation);
  const serverDirectEmissions = estimateEnergyEmissions(serverEnergy, onPremLocation);
  const networkDirectEmissions = estimateEnergyEmissions(networkEnergy, onPremLocation);

  return {
    user: desktopDirectEmissions + laptopDirectEmissions,
    server: serverDirectEmissions,
    network: networkDirectEmissions,
  };
}
