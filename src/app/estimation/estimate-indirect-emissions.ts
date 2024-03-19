import { Cloud, IndirectEstimation, MonthlyCloudBill } from '../carbon-estimator';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { KilowattHour } from '../types/units';

// Calculated in spreadsheet, need some link to explanation
const COST_TO_KWH_RATIO = 0.156;
const AVERAGE_PUE = 1.18;

export function estimateIndirectEmissions(input: Cloud): IndirectEstimation {
  if (input.noCloudServices) {
    return {
      cloud: 0,
      saas: 0,
      managed: 0,
    };
  }
  const cloudEnergy = estimateCloudEnergy(input.monthlyCloudBill);
  const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, input.cloudLocation);
  // TODO - Better method for cloud embodied carbon
  const cloudUpstreamEmissions = cloudDirectEmissions * (2 / 8);
  return { cloud: cloudDirectEmissions + cloudUpstreamEmissions, saas: 0, managed: 0 };
}

function estimateCloudEnergy(monthlyCloudBill: MonthlyCloudBill): KilowattHour {
  const range = monthlyCloudBill.split('-');
  const midpoint = (Number(range[0]) + Number(range[1])) / 2;

  return midpoint * COST_TO_KWH_RATIO * AVERAGE_PUE;
}
