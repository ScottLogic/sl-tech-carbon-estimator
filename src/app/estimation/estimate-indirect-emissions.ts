import { Cloud, IndirectEstimation } from '../carbon-estimator';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { KgCo2e, KilowattHour } from '../types/units';

// Calculated in spreadsheet, explained in assumptions-and-limitation component
const COST_TO_KWH_RATIO = 0.156;
const COST_TO_UPSTREAM_RATIO = 0.0164;
const AVERAGE_PUE = 1.18;

export function estimateIndirectEmissions(input: Cloud): IndirectEstimation {
  if (input.noCloudServices) {
    return {
      cloud: 0,
      saas: 0,
      managed: 0,
    };
  }
  const midpoint = (input.monthlyCloudBill.min + input.monthlyCloudBill.max) / 2;
  const cloudEnergy = estimateCloudEnergy(midpoint);
  const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, input.cloudLocation);
  const cloudUpstreamEmissions = estimateCloudUpstream(midpoint);
  return { cloud: cloudDirectEmissions + cloudUpstreamEmissions, saas: 0, managed: 0 };
}

function estimateCloudEnergy(monthlyCloudBill: number): KilowattHour {
  return monthlyCloudBill * COST_TO_KWH_RATIO * AVERAGE_PUE;
}

function estimateCloudUpstream(monthlyCloudBill: number): KgCo2e {
  return monthlyCloudBill * COST_TO_UPSTREAM_RATIO;
}
