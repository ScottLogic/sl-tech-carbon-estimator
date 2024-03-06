import { PurposeOfSite, Location } from '../carbon-estimator';
import { estimateEnergyEmissions as estimateEnergyEmissions } from './estimate-energy-emissions';
import { Gb, Hour, KilowattHour } from '../types/units';

interface SiteInformation {
  averageMonthlyUserTime: Hour,
  averageMonthlyUserData: Gb,
}

// See https://sustainablewebdesign.org/calculating-digital-emissions/
// TODO - Split this into network by GB and end user by time
const DOWNSTREAM_GB_TO_KWH_RATIO = 0.5346;

const siteTypeInfo: Record<PurposeOfSite, SiteInformation> = {
  information: {
    averageMonthlyUserTime: 0.016,
    averageMonthlyUserData: 0.000781
  },
  eCommerce: {
    averageMonthlyUserTime: 0.1,
    averageMonthlyUserData: 0.01656
  },
  socialMedia: {
    averageMonthlyUserTime: 16.3,
    averageMonthlyUserData: 4.4443
  },
  streaming: {
    averageMonthlyUserTime: 22.1429,
    averageMonthlyUserData: 10.3912
  },
  average: {
    averageMonthlyUserTime: 9.648,
    averageMonthlyUserData: 3.713
  }
}

export function estimateDownstreamEmissions(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite, customerLocation: Location) {
  const downstreamDataTransfer = estimateDownstreamDataTransfer(monthlyActiveUsers, purposeOfSite);
  const downstreamEnergy = estimateDownstreamEnergy(downstreamDataTransfer);
  const downstreamEmissions = estimateEnergyEmissions(downstreamEnergy, customerLocation);
  return downstreamEmissions;
}

function estimateDownstreamDataTransfer(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Gb {
  if (monthlyActiveUsers === 0) {
    return 0;
  }

  return siteTypeInfo[purposeOfSite].averageMonthlyUserData * monthlyActiveUsers * 12;
}

function estimateDownstreamEnergy(dataTransferred: Gb): KilowattHour {
  return dataTransferred * DOWNSTREAM_GB_TO_KWH_RATIO;
}

