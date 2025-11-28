import {
  PurposeOfSite,
  Downstream,
  DownstreamEstimation,
  BasePurposeOfSite,
  basePurposeArray,
} from '../types/carbon-estimator';
import { estimateEnergyEmissions } from './estimate-energy-emissions';
import { Gb, Hour, KilowattHour, gCo2ePerKwh } from '../types/units';
import { AverageDeviceType, averagePersonalComputer, mobile } from './device-type';
import { ICO2Calculator } from '../facades/ICO2Calculator';
import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { Injectable, inject } from '@angular/core';

interface SiteInformation {
  averageMonthlyUserTime: Hour;
  averageMonthlyUserData: Gb;
}

@Injectable({
  providedIn: 'root',
})
export class DownstreamEmissionsEstimator {
  private co2Calc = inject<ICO2Calculator>(CO2_CALCULATOR);

  private readonly BYTES_IN_GIGABYTE = 1000 * 1000 * 1000;

  public readonly siteTypeInfo: Record<PurposeOfSite, SiteInformation>;

  private static addAverage(input: Record<BasePurposeOfSite, SiteInformation>): Record<PurposeOfSite, SiteInformation> {
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

  constructor() {
    // Needs source from our own research
    this.siteTypeInfo = DownstreamEmissionsEstimator.addAverage({
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
  }

  estimate(downstream: Downstream, downstreamIntensity: gCo2ePerKwh): DownstreamEstimation {
    if (downstream.noDownstream) {
      return { customer: 0, networkTransfer: 0, downstreamInfrastructure: 0 };
    }

    const downstreamDataTransfer = this.estimateDownstreamDataTransfer(
      downstream.monthlyActiveUsers,
      downstream.purposeOfSite
    );
    const customerEmissions = this.estimateCustomerEmissions(downstream, downstreamDataTransfer, downstreamIntensity);
    const networkEmissions = this.estimateNetworkEmissions(downstream, downstreamDataTransfer, this.co2Calc);
    const downstreamInfrastructureEmissions = this.estimateDownstreamInfrastructureEmissions(
      downstream,
      downstreamDataTransfer,
      downstreamIntensity
    );
    return {
      customer: customerEmissions,
      networkTransfer: networkEmissions,
      downstreamInfrastructure: downstreamInfrastructureEmissions,
    };
  }

  estimateDownstreamEmissions(
    downstream: Downstream,
    downstreamIntensity: gCo2ePerKwh,
    co2Calc: ICO2Calculator
  ): DownstreamEstimation {
    if (downstream.noDownstream) {
      return { customer: 0, networkTransfer: 0, downstreamInfrastructure: 0 };
    }

    const downstreamDataTransfer = this.estimateDownstreamDataTransfer(
      downstream.monthlyActiveUsers,
      downstream.purposeOfSite
    );
    const customerEmissions = this.estimateCustomerEmissions(downstream, downstreamDataTransfer, downstreamIntensity);
    const networkEmissions = this.estimateNetworkEmissions(downstream, downstreamDataTransfer, co2Calc);
    const downstreamInfrastructureEmissions = this.estimateDownstreamInfrastructureEmissions(
      downstream,
      downstreamDataTransfer,
      downstreamIntensity
    );
    return {
      customer: customerEmissions,
      networkTransfer: networkEmissions,
      downstreamInfrastructure: downstreamInfrastructureEmissions,
    };
  }

  estimateDownstreamDataTransfer(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Gb {
    return this.siteTypeInfo[purposeOfSite].averageMonthlyUserData * monthlyActiveUsers * 12;
  }

  estimateCustomerEmissions(downstream: Downstream, downstreamDataTransfer: number, downstreamIntensity: gCo2ePerKwh) {
    const customerTime = this.estimateCustomerTime(downstream.monthlyActiveUsers, downstream.purposeOfSite);
    const customerEnergy = this.estimateCustomerEnergy(
      downstreamDataTransfer,
      customerTime,
      downstream.mobilePercentage
    );
    return estimateEnergyEmissions(customerEnergy, downstreamIntensity);
  }

  estimateCustomerTime(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite): Hour {
    return this.siteTypeInfo[purposeOfSite].averageMonthlyUserTime * monthlyActiveUsers * 12;
  }

  estimateCustomerEnergy(dataTransferred: Gb, userTime: Hour, mobilePercentage: number): KilowattHour {
    const averageDevice = new AverageDeviceType(
      { device: mobile, percentage: mobilePercentage },
      { device: averagePersonalComputer, percentage: 100 - mobilePercentage }
    );
    return averageDevice.estimateEnergy(userTime);
  }

  estimateNetworkEmissions(downstream: Downstream, downstreamDataTransfer: number, co2Calc: ICO2Calculator) {
    const options = {
      gridIntensity: {
        device: 0,
        network: { country: downstream.customerLocation },
        dataCenter: 0,
      },
    };
    const result = co2Calc.perByteTrace(downstreamDataTransfer * this.BYTES_IN_GIGABYTE, false, options);
    if (typeof result.co2 !== 'number') {
      return result.co2.networkCO2 / 1000;
    }
    throw new Error('perByteTrace should return CO2EstimateComponents for segment results');
  }

  estimateDownstreamInfrastructureEmissions(
    _downstream: Downstream,
    _downstreamDataTransfer: number,
    _downstreamIntensity: gCo2ePerKwh
  ) {
    return 0; //No method for estimation of IoT devices, etc. as of 12/08/25 for schema v0.0.2
  }
}
