import { Injectable, inject } from '@angular/core';
import {
  CarbonEstimation,
  CarbonEstimationPercentages,
  CarbonEstimationValues,
  EstimatorValues,
} from '../types/carbon-estimator';
import { estimateIndirectEmissions } from '../estimation/estimate-indirect-emissions';
import { estimateDirectEmissions } from '../estimation/estimate-direct-emissions';
import { DownstreamEmissionsEstimator } from '../estimation/estimate-downstream-emissions';
import { estimateUpstreamEmissions } from '../estimation/estimate-upstream-emissions';
import { LoggingService } from './logging.service';
import { NumberObject, sumValues, multiplyValues } from '../utils/number-object';
import { version } from '../../../package.json';
import { desktop, laptop, monitor, network, server } from '../estimation/device-type';
import { ON_PREMISE_AVERAGE_PUE } from '../estimation/constants';
import { DeviceUsage, createDeviceUsage } from '../estimation/device-usage';
import { CarbonIntensityService } from './carbon-intensity.service';

@Injectable({
  providedIn: 'root',
})
export class CarbonEstimationService {
  private carbonIntensityService = inject(CarbonIntensityService);
  private loggingService = inject(LoggingService);
  private downstreamEmissionsEstimator = inject(DownstreamEmissionsEstimator);

  calculateCarbonEstimation(formValue: EstimatorValues): CarbonEstimation {
    this.loggingService.log(`Input Values: ${formatObject(formValue)}`);

    const deviceUsage = this.estimateDeviceUsage(formValue);

    const upstreamEmissions = estimateUpstreamEmissions(deviceUsage);
    this.loggingService.log(`Estimated Upstream Emissions: ${formatCarbonEstimate(upstreamEmissions)}`);
    const directEmissions = estimateDirectEmissions(deviceUsage);
    this.loggingService.log(`Estimated Direct Emissions: ${formatCarbonEstimate(directEmissions)}`);
    const indirectIntensity = this.carbonIntensityService.getCarbonIntensity(formValue.cloud.cloudLocation);
    const indirectEmissions = estimateIndirectEmissions(formValue.cloud, indirectIntensity);
    this.loggingService.log(`Estimated Indirect Emissions: ${formatCarbonEstimate(indirectEmissions)}`);
    const downstreamIntensity = this.carbonIntensityService.getCarbonIntensity(formValue.downstream.customerLocation);
    // const downstreamEmissions = estimateDownstreamEmissions(formValue.downstream, downstreamIntensity, this.co2Calc);
    const downstreamEmissions = this.downstreamEmissionsEstimator.estimate(formValue.downstream, downstreamIntensity);
    this.loggingService.log(`Estimated Downstream Emissions: ${formatCarbonEstimate(downstreamEmissions)}`);

    const values = {
      version,
      upstreamEmissions: upstreamEmissions,
      directEmissions: directEmissions,
      indirectEmissions: indirectEmissions,
      downstreamEmissions: downstreamEmissions,
      totalEmissions:
        sumValues(upstreamEmissions) +
        sumValues(directEmissions) +
        sumValues(indirectEmissions) +
        sumValues(downstreamEmissions),
    };

    const percentages = toPercentages(values);

    return { values: values, percentages: percentages } as CarbonEstimation;
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
    const employeeNetworkCount = estimateNetworkDeviceCount(desktopCount + laptopCount);
    const serverNetworkCount = estimateNetworkDeviceCount(serverCount);
    const monitorCount = headCount;

    this.loggingService.log(
      `Estimated Device Counts: ${formatObject({ desktopCount, laptopCount, serverCount, employeeNetworkCount, serverNetworkCount, monitorCount })}`
    );

    const employeeIntensity = this.carbonIntensityService.getCarbonIntensity(formValue.upstream.employeeLocation);
    const onPremIntensity = this.carbonIntensityService.getCarbonIntensity(formValue.onPremise.serverLocation);
    return [
      createDeviceUsage(desktop, 'employee', employeeIntensity, desktopCount),
      createDeviceUsage(laptop, 'employee', employeeIntensity, laptopCount),
      createDeviceUsage(network, 'network', employeeIntensity, employeeNetworkCount),
      createDeviceUsage(server, 'server', onPremIntensity, serverCount, ON_PREMISE_AVERAGE_PUE),
      createDeviceUsage(network, 'network', onPremIntensity, serverNetworkCount, ON_PREMISE_AVERAGE_PUE),
      createDeviceUsage(monitor, 'employee', employeeIntensity, monitorCount),
    ];
  }
}

function toPercentages(input: CarbonEstimationValues): CarbonEstimationPercentages {
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
  return Math.ceil(deviceCount / 16);
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
