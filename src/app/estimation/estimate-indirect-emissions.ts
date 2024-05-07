import { Cloud, IndirectEstimation } from '../types/carbon-estimator';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { KgCo2e, KilowattHour, gCo2ePerKwh } from '../types/units';
import { CLOUD_AVERAGE_PUE } from './constants';

// Calculated in spreadsheet, explained in assumptions-and-limitation component
const COST_TO_KWH_RATIO = 0.156;
const COST_TO_UPSTREAM_RATIO = 0.0164;
export function estimateIndirectEmissions(input: Cloud, cloudIntensity: gCo2ePerKwh): IndirectEstimation {
  if (input.noCloudServices) {
    return {
      cloud: 0,
      saas: 0,
      managed: 0,
    };
  }
  const midpoint = (input.monthlyCloudBill.min + input.monthlyCloudBill.max) / 2;
  const cloudEnergy = estimateCloudEnergy(midpoint);
  const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, cloudIntensity);
  const cloudUpstreamEmissions = estimateCloudUpstream(midpoint);
  return { cloud: cloudDirectEmissions + cloudUpstreamEmissions, saas: 0, managed: 0 };
}

function estimateCloudEnergy(monthlyCloudBill: number): KilowattHour {
  return monthlyCloudBill * COST_TO_KWH_RATIO * CLOUD_AVERAGE_PUE * 12;
}

function estimateCloudUpstream(monthlyCloudBill: number): KgCo2e {
  return monthlyCloudBill * COST_TO_UPSTREAM_RATIO * 12;
}
