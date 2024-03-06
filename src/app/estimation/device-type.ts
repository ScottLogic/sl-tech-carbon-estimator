import { Hour, KgCo2e, KilowattHour, Watt } from '../types/units';

class DeviceType {
  constructor(
    private averagePower: Watt,
    private averageYearlyUsage: Hour,
    private embodiedCarbonRatio: number
  ) {}

  estimateYearlyEnergy(deviceCount: number): KilowattHour {
    return this.estimateEnergy(deviceCount * this.averageYearlyUsage);
  }

  estimateEnergy(usage: Hour): KilowattHour {
    return (usage * this.averagePower) / 1000;
  }

  estimateYearlyUpstreamEmissions(yearlyDirectEmissions: KgCo2e): KgCo2e {
    return this.embodiedCarbonRatio * yearlyDirectEmissions;
  }
}

// Sources for device power figures are listed on https://www.techcarbonstandard.org/, rounded to nearest watt
export const laptop = new DeviceType(17, 8 * 230, 80 / 20);
export const desktop = new DeviceType(72, 8 * 230, 50 / 50);
export const server = new DeviceType(400, 24 * 365, 20 / 80);
export const network = new DeviceType(150, 24 * 365, 20 / 80);
export const mobile = new DeviceType(0.65, 24 * 365, 80 / 20);
