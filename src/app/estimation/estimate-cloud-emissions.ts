import { MonthlyCloudBill, WorldLocation } from '../carbon-estimator';
import { server } from './device-type';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { KgCo2e, KilowattHour } from '../types/units';

// Calculated in spreadsheet, need some link to explanation
const COST_TO_KWH_RATIO = 0.156;
const AVERAGE_PUE = 1.18;

export function estimateCloudEmissions(
  cloudPercentage: number,
  monthlyCloudBill: MonthlyCloudBill,
  cloudLocation: WorldLocation
): KgCo2e {
  const cloudEnergy = estimateCloudEnergy(cloudPercentage, monthlyCloudBill);
  const cloudDirectEmissions = estimateEnergyEmissions(cloudEnergy, cloudLocation);
  const cloudUpstreamEmissions = server.estimateYearlyUpstreamEmissions(cloudDirectEmissions);
  const totalCloudEmissions = cloudDirectEmissions + cloudUpstreamEmissions;
  return totalCloudEmissions;
}

function estimateCloudEnergy(cloudPercentage: number, monthlyCloudBill: MonthlyCloudBill): KilowattHour {
  if (cloudPercentage === 0) {
    return 0;
  }

  const range = monthlyCloudBill.split('-');
  const midpoint = (Number(range[0]) + Number(range[1])) / 2;

  return midpoint * COST_TO_KWH_RATIO * AVERAGE_PUE;
}
