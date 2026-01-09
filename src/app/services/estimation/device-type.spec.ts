import { laptop, desktop, server, network, AverageDeviceType, averagePersonalComputer, mobile } from './device-type';

describe('Device type of laptop', () => {
  it('Estimates kWh of 1 laptop', () => {
    expect(laptop.estimateYearlyEnergy(1)).toBeCloseTo(31.28);
  });

  it('Estimates kWh of 30 laptops', () => {
    expect(laptop.estimateYearlyEnergy(30)).toBeCloseTo(938.4);
  });

  it('Estimates upstream emissions of 1 laptop', () => {
    expect(laptop.estimateYearlyUpstreamEmissions(1)).toBeCloseTo(57.5);
  });
});

describe('Device type of desktop', () => {
  it('Estimates kWh of 1 desktop', () => {
    expect(desktop.estimateYearlyEnergy(1)).toBeCloseTo(132.48);
  });

  it('Estimates kWh of 30 desktops', () => {
    expect(desktop.estimateYearlyEnergy(30)).toBeCloseTo(3974.4);
  });

  it('Estimates upstream emissions of 1 desktop', () => {
    expect(desktop.estimateYearlyUpstreamEmissions(1)).toBeCloseTo(100);
  });
});

describe('Device type of server', () => {
  it('Estimates kWh of 1 server', () => {
    expect(server.estimateYearlyEnergy(1)).toBeCloseTo(3504);
  });

  it('Estimates kWh of 30 servers', () => {
    expect(server.estimateYearlyEnergy(30)).toBeCloseTo(105120);
  });

  it('Estimates upstream emissions of 1 server', () => {
    expect(server.estimateYearlyUpstreamEmissions(1)).toBeCloseTo(362.5);
  });
});

describe('Device type of network', () => {
  it('Estimates kWh of 1 network device', () => {
    expect(network.estimateYearlyEnergy(1)).toBeCloseTo(762.12);
  });

  it('Estimates kWh of 30 network devices', () => {
    expect(network.estimateYearlyEnergy(30)).toBeCloseTo(22863.6);
  });

  it('Estimates upstream emissions of 1 network device', () => {
    expect(network.estimateYearlyUpstreamEmissions(1)).toBeCloseTo(162.5);
  });
});

describe('Average Device Type', () => {
  it('Throws if not given any devices', () => {
    expect(() => new AverageDeviceType()).toThrowError('Average Device must be constructed from at least one device');
  });

  it('Has a proportion of the values from multiple devices', () => {
    const averageDevice = new AverageDeviceType({ device: laptop, percentage: 50 }, { device: mobile, percentage: 50 });
    expect(averageDevice.averageEmbodiedCarbon).toBe((laptop.averageEmbodiedCarbon + mobile.averageEmbodiedCarbon) / 2);
    expect(averageDevice.averageLifespan).toBe((laptop.averageLifespan + mobile.averageLifespan) / 2);
    expect(averageDevice.averagePower).toBe((laptop.averagePower + mobile.averagePower) / 2);
    expect(averageDevice.averageYearlyUsage).toBe((laptop.averageYearlyUsage + mobile.averageYearlyUsage) / 2);
  });

  it('Should calculate energy equivalent to separate amount of devices', () => {
    const averageDevice = new AverageDeviceType(
      { device: laptop, percentage: 75 },
      { device: desktop, percentage: 25 }
    );
    const laptopEnergy = laptop.estimateYearlyEnergy(75);
    const desktopEnergy = desktop.estimateYearlyEnergy(25);
    const averageEnergy = averageDevice.estimateYearlyEnergy(100);
    expect(averageEnergy).toBe(laptopEnergy + desktopEnergy);
  });

  it('Should calculate upstream emissions equivalent to separate amount of devices', () => {
    const averageDevice = new AverageDeviceType(
      { device: laptop, percentage: 75 },
      { device: desktop, percentage: 25 }
    );
    const laptopUpstream = laptop.estimateYearlyUpstreamEmissions(75);
    const desktopUpstream = desktop.estimateYearlyUpstreamEmissions(25);
    const averageUpstream = averageDevice.estimateYearlyUpstreamEmissions(100);
    expect(averageUpstream).toBe(laptopUpstream + desktopUpstream);
  });

  it('Exports a standard average PC type', () => {
    expect(averagePersonalComputer.averagePower).toBeCloseTo(52.95);
  });
});
