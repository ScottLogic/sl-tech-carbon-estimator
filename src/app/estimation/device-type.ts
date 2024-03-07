import { Hour, KgCo2e, KilowattHour, Watt, Year } from '../types/units';

class DeviceType {
  constructor(
    private averagePower: Watt,
    private averageYearlyUsage: Hour,
    private averageEmbodiedCarbon: KgCo2e,
    private averageLifespan: Year
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

// Sources for device power figures are listed on https://www.techcarbonstandard.org/, rounded to nearest watt
export const laptop = new DeviceType(17, 8 * 230, 230, 4);
export const desktop = new DeviceType(72, 8 * 230, 400, 4);
export const server = new DeviceType(400, 24 * 365, 1450, 4);
export const network = new DeviceType(150, 24 * 365, 1000, 4);
export const mobile = new DeviceType(0.65, 24 * 365, 54, 3);
export const tablet = new DeviceType(4, 24 * 365, 134, 3);
