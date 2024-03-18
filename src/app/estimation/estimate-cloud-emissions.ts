import { Cloud, MonthlyCloudBill } from '../carbon-estimator';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { KgCo2e, KilowattHour } from '../types/units';

// Calculated in spreadsheet, need some link to explanation
const COST_TO_KWH_RATIO = 0.156;
const AVERAGE_PUE = 1.18;

export function estimateCloudEmissions(input: Cloud): KgCo2e {
  if (input.noCloudServices) {
    return 0;
  }
  const cloudEnergy = estimateCloudEnergy(input.monthlyCloudBill);
  const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, input.cloudLocation);
  // TODO - Better method for cloud embodied carbon
  const cloudUpstreamEmissions = cloudDirectEmissions * (2 / 8);
  return cloudDirectEmissions + cloudUpstreamEmissions;
}

function estimateCloudEnergy(monthlyCloudBill: MonthlyCloudBill): KilowattHour {
  const range = monthlyCloudBill.split('-');
  const midpoint = (Number(range[0]) + Number(range[1])) / 2;

  return midpoint * COST_TO_KWH_RATIO * AVERAGE_PUE;
}
