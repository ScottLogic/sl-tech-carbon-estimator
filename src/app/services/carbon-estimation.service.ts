import { Injectable } from '@angular/core';
import { CarbonEstimation, DeviceCounts, EstimatorValues } from '../carbon-estimator';
import { estimateCloudEmissions } from '../estimation/estimate-cloud-emissions';
import { estimateDirectEmissions } from '../estimation/estimate-direct-emissions';
import { estimateDownstreamEmissions } from '../estimation/estimate-downstream-emissions';
import { estimateUpstreamEmissions } from '../estimation/estimate-upstream-emissions';

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

    const deviceCounts = estimateDeviceCounts(desktopPercent, headCount, cloudPercentage, formValue);

    const upstreamEmissions = estimateUpstreamEmissions(deviceCounts);
    const directEmissions = estimateDirectEmissions(deviceCounts, onPremLocation);
    const cloudEmissions = estimateCloudEmissions(cloudPercentage, monthlyCloudBill, cloudLocation);
    const downstreamEmissions = estimateDownstreamEmissions(formValue.downstream);

    return toPercentages({
      version: '0.0.1',
      upstreamEmissions: upstreamEmissions,
      directEmissions: directEmissions,
      cloudEmissions: cloudEmissions,
      downstreamEmissions: downstreamEmissions,
    });
  }
}

function estimateDeviceCounts(
  desktopPercent: number,
  headCount: number,
  cloudPercentage: number,
  formValue: EstimatorValues
): DeviceCounts {
  const laptopPercent = 100 - desktopPercent;

  const desktopCount = calculateCeilingPercentage(desktopPercent, headCount);
  const laptopCount = calculateCeilingPercentage(laptopPercent, headCount);
  const serverCount = estimateServerCount(cloudPercentage, headCount, formValue.onPrem?.numberOfServers);
  const networkCount = estimateNetworkDeviceCount(desktopCount, serverCount);
  return { desktopCount, laptopCount, serverCount, networkCount };
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
