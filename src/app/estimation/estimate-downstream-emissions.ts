import { PurposeOfSite, Downstream } from '../carbon-estimator';
import { estimateEnergyEmissions, getCarbonIntensity } from './estimate-energy-emissions';
import { Gb, Hour, KgCo2e, KilowattHour } from '../types/units';
import { AverageDeviceType, averagePersonalComputer, mobile } from './device-type';
import { co2 } from '@tgwf/co2';

interface SiteInformation {
  averageMonthlyUserTime: Hour;
  averageMonthlyUserData: Gb;
}

interface CO2EstimateComponents {
  consumerDeviceCO2: number;
  networkCO2: number;
  dataCenterCO2: number;
  productionCO2: number;
  total: number;
}

const BYTES_IN_GIGABYTE = 1000 * 1000 * 1000;

// Needs source from our own research
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
  const endUserEmissions = estimateEndUserEmissions(downstream, downstreamDataTransfer);
  const networkEmissions = estimateNetworkEmissions(downstream, downstreamDataTransfer);
  return endUserEmissions + networkEmissions;
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
      deviceCarbonIntensity: {
        value: 0,
      },
      network: {
        value: getCarbonIntensity(downstream.customerLocation),
      },
      dataCenterCarbonIntensity: {
        value: 0,
      },
    },
  };
  const result = co2Inst.perByteTrace(downstreamDataTransfer * BYTES_IN_GIGABYTE, false, options);
  // Force a cast to type we know is returned when segment option is used
  return (result.co2 as unknown as CO2EstimateComponents).networkCO2 / 1000;
}
