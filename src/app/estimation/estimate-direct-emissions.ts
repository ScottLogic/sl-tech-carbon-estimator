import { DeviceCounts, WorldLocation } from '../carbon-estimator';
import { KgCo2e } from '../types/units';
import { desktop, laptop, network, server } from './device-type';
import { estimateEnergyEmissions } from './estimate-energy-emissions';

export function estimateDirectEmissions(deviceCounts: DeviceCounts, onPremLocation: WorldLocation): KgCo2e {
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