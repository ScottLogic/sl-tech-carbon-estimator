import {
  PurposeOfSite,
  Downstream,
  DownstreamEstimation,
  BasePurposeOfSite,
  basePurposeArray,
} from '../types/carbon-estimator';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { Gb, Hour, KilowattHour } from '../types/units';
import { AverageDeviceType, averagePersonalComputer, mobile } from './device-type';
import { co2, averageIntensity } from '@tgwf/co2';

interface SiteInformation {
  averageMonthlyUserTime: Hour;
  averageMonthlyUserData: Gb;
}

const BYTES_IN_GIGABYTE = 1000 * 1000 * 1000;

function addAverage(input: Record<BasePurposeOfSite, SiteInformation>): Record<PurposeOfSite, SiteInformation> {
  let totalMonthlyUserTime = 0;
  let totalMonthlyUserData = 0;
  for (const value of Object.values(input)) {
    totalMonthlyUserTime += value.averageMonthlyUserTime;
    totalMonthlyUserData += value.averageMonthlyUserData;
  }
  const count = basePurposeArray.length;
  return {
    ...input,
    average: {
      averageMonthlyUserTime: totalMonthlyUserTime / count,
      averageMonthlyUserData: totalMonthlyUserData / count,
    },
  };
}

// Needs source from our own research
export const siteTypeInfo: Record<PurposeOfSite, SiteInformation> = addAverage({
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
});

export function estimateDownstreamEmissions(downstream: Downstream): DownstreamEstimation {
  if (downstream.noDownstream) {
    return { endUser: 0, networkTransfer: 0 };
  }

  const downstreamDataTransfer = estimateDownstreamDataTransfer(
    downstream.monthlyActiveUsers,
    downstream.purposeOfSite
  );
  const endUserEmissions = estimateEndUserEmissions(downstream, downstreamDataTransfer);
  const networkEmissions = estimateNetworkEmissions(downstream, downstreamDataTransfer);
  return { endUser: endUserEmissions, networkTransfer: networkEmissions };
}

function estimateDownstreamDataTransfer(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Gb {
  return siteTypeInfo[purposeOfSite].averageMonthlyUserData * monthlyActiveUsers * 12;
}

function estimateEndUserEmissions(downstream: Downstream, downstreamDataTransfer: number) {
  const endUserTime = estimateEndUserTime(downstream.monthlyActiveUsers, downstream.purposeOfSite);
  const endUserEnergy = estimateEndUserEnergy(downstreamDataTransfer, endUserTime, downstream.mobilePercentage);
  return estimateEnergyEmissions(endUserEnergy, downstream.customerLocation);
}

function estimateEndUserTime(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Hour {
  return siteTypeInfo[purposeOfSite].averageMonthlyUserTime * monthlyActiveUsers * 12;
}

function estimateEndUserEnergy(dataTransferred: Gb, userTime: Hour, mobilePercentage: number): KilowattHour {
  const averageDevice = new AverageDeviceType(
    { device: mobile, percentage: mobilePercentage },
    { device: averagePersonalComputer, percentage: 100 - mobilePercentage }
  );
  return averageDevice.estimateEnergy(userTime);
}

function estimateNetworkEmissions(downstream: Downstream, downstreamDataTransfer: number) {
  const co2Inst = new co2({
    model: 'swd',
    results: 'segment',
  });
  const options = {
    gridIntensity: {
      device: 0,
      network: averageIntensity.data[downstream.customerLocation],
      dataCenter: 0,
    },
  };
  const result = co2Inst.perByteTrace(downstreamDataTransfer * BYTES_IN_GIGABYTE, false, options);
  if (typeof result.co2 !== 'number') {
    return result.co2.networkCO2 / 1000;
  }
  throw new Error('perByteTrace should return CO2EstimateComponents for segment results');
}
