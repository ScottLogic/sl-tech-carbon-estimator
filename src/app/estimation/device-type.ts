import { Hour, KgCo2e, KilowattHour, Watt, Year } from '../types/units';

export class DeviceType {
  constructor(
    readonly averagePower: Watt,
    readonly averageYearlyUsage: Hour,
    readonly averageEmbodiedCarbon: KgCo2e,
    readonly averageLifespan: Year
  ) {}

  estimateYearlyEnergy(deviceCount: number): KilowattHour {
    return this.estimateEnergy(deviceCount * this.averageYearlyUsage);
  }

  estimateEnergy(usage: Hour): KilowattHour {
    return (usage * this.averagePower) / 1000;
  }

  estimateYearlyUpstreamEmissions(deviceCount: number): KgCo2e {
    return this.estimateYearlyUpstreamEmissionsForLifespan(deviceCount, this.averageLifespan);
  }

  estimateYearlyUpstreamEmissionsForLifespan(deviceCount: number, lifespan: Year): KgCo2e {
    return (this.averageEmbodiedCarbon / lifespan) * deviceCount;
  }
}

type DeviceShare = {
  device: DeviceType;
  percentage: number;
};

export class AverageDeviceType extends DeviceType {
  constructor(...shares: DeviceShare[]) {
    if (shares.length === 0) {
      throw new Error('Average Device must be constructed from at least one device');
    }
    let totalPower: Watt = 0;
    let totalYearlyUsage: Hour = 0;
    let totalEmbodiedCarbon: KgCo2e = 0;
    let totalLifespan: Year = 0;
    for (const share of shares) {
      const percentRatio = share.percentage / 100;
      totalPower += percentRatio * share.device.averagePower;
      totalYearlyUsage += percentRatio * share.device.averageYearlyUsage;
      totalEmbodiedCarbon += percentRatio * share.device.averageEmbodiedCarbon;
      totalLifespan += percentRatio * share.device.averageLifespan;
    }

    super(totalPower, totalYearlyUsage, totalEmbodiedCarbon, totalLifespan);
  }
}

// Sources for device power figures are listed on https://www.techcarbonstandard.org/, rounded to nearest watt
export const laptop = new DeviceType(17, 8 * 230, 230, 4);
export const desktop = new DeviceType(72, 8 * 230, 400, 4);
export const server = new DeviceType(400, 24 * 365, 1450, 4);
export const network = new DeviceType(150, 24 * 365, 650, 4);
export const mobile = new DeviceType(1, 24 * 365, 54, 3);
export const tablet = new DeviceType(3, 24 * 365, 134, 3);
export const monitor = new DeviceType(30, 8 * 230, 350, 6);

export const averagePersonalComputer = new AverageDeviceType(
  { device: desktop, percentage: 37 },
  { device: laptop, percentage: 63 },
  { device: monitor, percentage: 52 }
);
