import { Injectable } from '@angular/core';
import { CarbonEstimation } from '../carbon-estimator';
import { desktop, laptop, network, server } from '../estimation/device-type';
import { estimateEnergyEmissions as estimateEnergyEmissions } from '../estimation/estimate-energy-emissions';
import { estimateCloudEmissions } from '../estimation/estimate-cloud-emissions';
import { estimateDownstreamEmissions } from '../estimation/estimate-downstream-emissions';
import { EstimatorValues } from '../carbon-estimator';

@Injectable({
  providedIn: 'root',
})
export class CarbonEstimationService {
  constructor() {}

  calculateCarbonEstimation(formValue: EstimatorValues): CarbonEstimation {
    // TODO - these should be required params
    const desktopPercent = formValue.upstream?.desktopToLaptopPercentage ?? 0;
    const headCount = formValue.upstream?.headCount ?? 0;
    const cloudPercentage = formValue.cloud?.cloudPercentage ?? 0;
    const monthlyCloudBill = formValue.cloud?.monthlyCloudBill ?? '0-200';
    const onPremLocation = formValue.onPrem?.location ?? 'global';
    const cloudLocation = formValue.cloud?.location ?? 'global';

    const laptopPercent = 100 - desktopPercent;

    const desktopCount = calculateCeilingPercentage(desktopPercent, headCount);
    const laptopCount = calculateCeilingPercentage(laptopPercent, headCount);
    const serverCount = estimateServerCount(cloudPercentage, headCount, formValue.onPrem?.numberOfServers);
    const networkCount = estimateNetworkDeviceCount(desktopCount, serverCount);

    const desktopEnergy = desktop.estimateYearlyEnergy(desktopCount);
    const laptopEnergy = laptop.estimateYearlyEnergy(laptopCount);
    const serverEnergy = server.estimateYearlyEnergy(serverCount);
    const networkEnergy = network.estimateYearlyEnergy(networkCount);

    const desktopDirectEmissions = estimateEnergyEmissions(desktopEnergy, onPremLocation);
    const laptopDirectEmissions = estimateEnergyEmissions(laptopEnergy, onPremLocation);
    const serverDirectEmissions = estimateEnergyEmissions(serverEnergy, onPremLocation);
    const networkDirectEmissions = estimateEnergyEmissions(networkEnergy, onPremLocation);

    const totalDirectEmissions =
      desktopDirectEmissions + laptopDirectEmissions + serverDirectEmissions + networkDirectEmissions;

    const desktopUpstreamEmissions = desktop.estimateYearlyUpstreamEmissions(desktopDirectEmissions);
    const laptopUpstreamEmissions = laptop.estimateYearlyUpstreamEmissions(laptopDirectEmissions);
    const serverUpstreamEmissions = server.estimateYearlyUpstreamEmissions(serverDirectEmissions);
    const networkUpstreamEmissions = network.estimateYearlyUpstreamEmissions(networkDirectEmissions);

    const totalUpstreamEmissions =
      desktopUpstreamEmissions + laptopUpstreamEmissions + serverUpstreamEmissions + networkUpstreamEmissions;

    const cloudEmissions = estimateCloudEmissions(cloudPercentage, monthlyCloudBill, cloudLocation);

    const downstreamEmissions = estimateDownstreamEmissions(formValue.downstream);

    return toPercentages({
      version: '0.0.1',
      upstreamEmissions: totalUpstreamEmissions,
      cloudEmissions: cloudEmissions,
      directEmissions: totalDirectEmissions,
      downstreamEmissions: downstreamEmissions,
    });
  }
}

function toPercentages(input: CarbonEstimation): CarbonEstimation {
  const total = input.upstreamEmissions + input.directEmissions + input.cloudEmissions + input.downstreamEmissions;
  if (total === 0) {
    return input;
  }
  const percentRatio = 100 / total;
  return {
    ...input,
    upstreamEmissions: input.upstreamEmissions * percentRatio,
    directEmissions: input.directEmissions * percentRatio,
    cloudEmissions: input.cloudEmissions * percentRatio,
    downstreamEmissions: input.downstreamEmissions * percentRatio,
  };
}

function calculateCeilingPercentage(percentage: number, value: number) {
  return Math.ceil((percentage / 100) * value);
}

function estimateServerCount(cloudPercentage: number, headCount: number, inputServerCount: number | undefined): number {
  if (inputServerCount !== undefined && inputServerCount >= 0) {
    return inputServerCount;
  }
  return calculateCeilingPercentage(100 - cloudPercentage, headCount * 0.1);
}

function estimateNetworkDeviceCount(desktopCount: number, serverCount: number) {
  return Math.ceil((desktopCount + serverCount) / 2);
}
