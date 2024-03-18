import { Injectable } from '@angular/core';
import { CarbonEstimation, DeviceCounts, EstimatorValues } from '../carbon-estimator';
import { estimateCloudEmissions } from '../estimation/estimate-cloud-emissions';
import { estimateDirectEmissions } from '../estimation/estimate-direct-emissions';
import { estimateDownstreamEmissions } from '../estimation/estimate-downstream-emissions';
import { estimateUpstreamEmissions } from '../estimation/estimate-upstream-emissions';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class CarbonEstimationService {
  constructor(private loggingService: LoggingService) {}

  calculateCarbonEstimation(formValue: EstimatorValues): CarbonEstimation {
    this.loggingService.log(`Input Values: ${JSON.stringify(formValue, undefined, 2)}`);

    const deviceCounts = estimateDeviceCounts(formValue);
    this.loggingService.log(`Estimated Device Counts: ${JSON.stringify(deviceCounts, undefined, 2)}`);

    const upstreamEmissions = estimateUpstreamEmissions(deviceCounts);
    this.loggingService.log(`Estimated Upstream Emissions: ${upstreamEmissions}kg CO2e`);
    const directEmissions = estimateDirectEmissions(deviceCounts, formValue.onPremise.serverLocation);
    this.loggingService.log(`Estimated Direct Emissions: ${directEmissions}kg CO2e`);
    const cloudEmissions = estimateCloudEmissions(formValue.cloud);
    this.loggingService.log(`Estimated Cloud Emissions: ${cloudEmissions}kg CO2e`);
    const downstreamEmissions = estimateDownstreamEmissions(formValue.downstream);
    this.loggingService.log(`Estimated Downstream Emissions: ${downstreamEmissions}kg CO2e`);

    return toPercentages({
      version: '0.0.1',
      upstreamEmissions: upstreamEmissions,
      directEmissions: directEmissions,
      cloudEmissions: cloudEmissions,
      downstreamEmissions: downstreamEmissions,
    });
  }
}

function estimateDeviceCounts(formValue: EstimatorValues): DeviceCounts {
  const desktopPercent = formValue.upstream.desktopPercentage;
  const headCount = formValue.upstream.headCount;
  const cloudPercentage = formValue.cloud.cloudPercentage;
  const laptopPercent = 100 - desktopPercent;

  const desktopCount = calculateCeilingPercentage(desktopPercent, headCount);
  const laptopCount = calculateCeilingPercentage(laptopPercent, headCount);
  const serverCount = estimateServerCount(cloudPercentage, headCount, formValue.onPremise?.numberOfServers);
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
