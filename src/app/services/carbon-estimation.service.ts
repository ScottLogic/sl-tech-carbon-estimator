import { Injectable } from '@angular/core';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { estimateIndirectEmissions } from '../estimation/estimate-indirect-emissions';
import { estimateDirectEmissions } from '../estimation/estimate-direct-emissions';
import { estimateDownstreamEmissions } from '../estimation/estimate-downstream-emissions';
import { estimateUpstreamEmissions } from '../estimation/estimate-upstream-emissions';
import { LoggingService } from './logging.service';
import { NumberObject, sumValues, multiplyValues } from '../utils/number-object';
import { version } from '../../../package.json';
import { desktop, laptop, network, server } from '../estimation/device-type';
import { ON_PREMISE_AVERAGE_PUE } from '../estimation/constants';
import { DeviceUsage, createDeviceUsage } from '../estimation/device-usage';

@Injectable({
  providedIn: 'root',
})
export class CarbonEstimationService {
  constructor(private loggingService: LoggingService) {}

  calculateCarbonEstimation(formValue: EstimatorValues): CarbonEstimation {
    this.loggingService.log(`Input Values: ${formatObject(formValue)}`);

    const deviceUsage = this.estimateDeviceUsage(formValue);

    const upstreamEmissions = estimateUpstreamEmissions(deviceUsage);
    this.loggingService.log(`Estimated Upstream Emissions: ${formatCarbonEstimate(upstreamEmissions)}`);
    const directEmissions = estimateDirectEmissions(deviceUsage);
    this.loggingService.log(`Estimated Direct Emissions: ${formatCarbonEstimate(directEmissions)}`);
    const indirectEmissions = estimateIndirectEmissions(formValue.cloud);
    this.loggingService.log(`Estimated Indirect Emissions: ${formatCarbonEstimate(indirectEmissions)}`);
    const downstreamEmissions = estimateDownstreamEmissions(formValue.downstream);
    this.loggingService.log(`Estimated Downstream Emissions: ${formatCarbonEstimate(downstreamEmissions)}`);

    return toPercentages({
      version,
      upstreamEmissions: upstreamEmissions,
      directEmissions: directEmissions,
      indirectEmissions: indirectEmissions,
      downstreamEmissions: downstreamEmissions,
    });
  }

  estimateServerCount(formValue: EstimatorValues): number {
    if (!formValue.onPremise.estimateServerCount) {
      return formValue.onPremise.numberOfServers;
    }
    const cloudPercentage = formValue.cloud.noCloudServices ? 0 : formValue.cloud.cloudPercentage;
    return calculateCeilingPercentage(100 - cloudPercentage, formValue.upstream.headCount * 0.1);
  }

  private estimateDeviceUsage(formValue: EstimatorValues): DeviceUsage[] {
    const desktopPercent = formValue.upstream.desktopPercentage;
    const headCount = formValue.upstream.headCount;
    const laptopPercent = 100 - desktopPercent;

    const desktopCount = calculateCeilingPercentage(desktopPercent, headCount);
    const laptopCount = calculateCeilingPercentage(laptopPercent, headCount);
    const serverCount = this.estimateServerCount(formValue);
    const employeeNetworkCount = estimateNetworkDeviceCount(desktopCount);
    const serverNetworkCount = estimateNetworkDeviceCount(serverCount);

    this.loggingService.log(
      `Estimated Device Counts: ${formatObject({ desktopCount, laptopCount, serverCount, employeeNetworkCount, serverNetworkCount })}`
    );

    const employeeLocation = formValue.upstream.employeeLocation;
    const onPremLocation = formValue.onPremise.serverLocation;
    return [
      createDeviceUsage(desktop, 'user', employeeLocation, desktopCount),
      createDeviceUsage(laptop, 'user', employeeLocation, laptopCount),
      createDeviceUsage(network, 'network', employeeLocation, employeeNetworkCount, ON_PREMISE_AVERAGE_PUE),
      createDeviceUsage(server, 'server', onPremLocation, serverCount, ON_PREMISE_AVERAGE_PUE),
      createDeviceUsage(network, 'network', onPremLocation, serverNetworkCount, ON_PREMISE_AVERAGE_PUE),
    ];
  }
}

function toPercentages(input: CarbonEstimation): CarbonEstimation {
  const total =
    sumValues(input.upstreamEmissions) +
    sumValues(input.directEmissions) +
    sumValues(input.indirectEmissions) +
    sumValues(input.downstreamEmissions);
  if (total === 0) {
    return input;
  }
  const percentRatio = 100 / total;
  return {
    ...input,
    upstreamEmissions: multiplyValues(input.upstreamEmissions, percentRatio),
    directEmissions: multiplyValues(input.directEmissions, percentRatio),
    indirectEmissions: multiplyValues(input.indirectEmissions, percentRatio),
    downstreamEmissions: multiplyValues(input.downstreamEmissions, percentRatio),
  };
}

function calculateCeilingPercentage(percentage: number, value: number) {
  return Math.ceil((percentage / 100) * value);
}

function estimateNetworkDeviceCount(deviceCount: number) {
  return Math.ceil(deviceCount / 2);
}

function formatObject(input: unknown): string {
  return JSON.stringify(input, undefined, 2);
}

function formatCarbonEstimate(input: NumberObject): string {
  const description = Object.entries(withTotal(input))
    .map(([key, value]) => {
      return `  "${key}": ${value.toLocaleString()}kg CO2e`;
    })
    .join(',\n');
  return `{\n${description}\n}`;
}

function withTotal(input: NumberObject): NumberObject {
  if (input['total'] !== undefined) {
    return input;
  }
  return { ...input, total: sumValues(input) };
}
