import { PurposeOfSite, Downstream } from '../carbon-estimator';
import { estimateEnergyEmissions as estimateEnergyEmissions } from './estimate-energy-emissions';
import { Gb, Hour, KgCo2e, KilowattHour } from '../types/units';
import { laptop, mobile } from './device-type';

interface SiteInformation {
  averageMonthlyUserTime: Hour;
  averageMonthlyUserData: Gb;
}

// See https://sustainablewebdesign.org/calculating-digital-emissions/
const NETWORK_GB_TO_KWH_RATIO = 0.1134;

const siteTypeInfo: Record<PurposeOfSite, SiteInformation> = {
  information: {
    averageMonthlyUserTime: 0.016,
    averageMonthlyUserData: 0.000781,
  },
  eCommerce: {
    averageMonthlyUserTime: 0.1,
    averageMonthlyUserData: 0.01656,
  },
  socialMedia: {
    averageMonthlyUserTime: 16.3,
    averageMonthlyUserData: 4.4443,
  },
  streaming: {
    averageMonthlyUserTime: 22.1429,
    averageMonthlyUserData: 10.3912,
  },
  average: {
    averageMonthlyUserTime: 9.648,
    averageMonthlyUserData: 3.713,
  },
};

export function estimateDownstreamEmissions(downstream?: Downstream): KgCo2e {
  if (!downstream || downstream.monthlyActiveUsers === 0) {
    return 0;
  }

  const downstreamDataTransfer = estimateDownstreamDataTransfer(
    downstream.monthlyActiveUsers,
    downstream.purposeOfSite
  );
  const downstreamEndUserTime = estimateDownstreamEndUserTime(downstream.monthlyActiveUsers, downstream.purposeOfSite);
  const downstreamEnergy = estimateDownstreamEnergy(
    downstreamDataTransfer,
    downstreamEndUserTime,
    downstream.mobilePercentage
  );
  const downstreamEmissions = estimateEnergyEmissions(downstreamEnergy, downstream.customerLocation);
  return downstreamEmissions;
}

function estimateDownstreamDataTransfer(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Gb {
  return siteTypeInfo[purposeOfSite].averageMonthlyUserData * monthlyActiveUsers * 12;
}

function estimateDownstreamEndUserTime(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Hour {
  return siteTypeInfo[purposeOfSite].averageMonthlyUserTime * monthlyActiveUsers * 12;
}

function estimateDownstreamEnergy(dataTransferred: Gb, userTime: Hour, mobilePercentage: number): KilowattHour {
  const mobileTime = (mobilePercentage / 100) * userTime;
  const generalTime = ((100 - mobilePercentage) / 100) * userTime;
  const mobileEnergy = mobile.estimateEnergy(mobileTime);
  // TODO: Add some kind of average device here
  const generalEnergy = laptop.estimateEnergy(generalTime);
  return mobileEnergy + generalEnergy + dataTransferred * NETWORK_GB_TO_KWH_RATIO;
}
