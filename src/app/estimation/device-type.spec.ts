import { laptop, desktop, server, network } from './device-type';

describe('Device type of laptop', () => {
  it('Calculates kWh of 1 laptop', () => {
    expect(laptop.estimateYearlyEnergy(1)).toBeCloseTo(31.28);
  });

  it('Calculates kWh of 30 laptops', () => {
    expect(laptop.estimateYearlyEnergy(30)).toBeCloseTo(938.4);
  });

  it('Calculates upstream emissions from direct', () => {
    expect(laptop.estimateYearlyUpstreamEmissions(20)).toBe(80);
  });
});

describe('Device type of desktop', () => {
  it('Calculates kWh of 1 desktop', () => {
    expect(desktop.estimateYearlyEnergy(1)).toBeCloseTo(132.48);
  });

  it('Calculates kWh of 30 desktops', () => {
    expect(desktop.estimateYearlyEnergy(30)).toBeCloseTo(3974.4);
  });

  it('Calculates upstream emissions from direct', () => {
    expect(desktop.estimateYearlyUpstreamEmissions(20)).toBe(20);
  });
});

describe('Device type of server', () => {
  it('Calculates kWh of 1 server', () => {
    expect(server.estimateYearlyEnergy(1)).toBeCloseTo(3504);
  });

  it('Calculates kWh of 30 servers', () => {
    expect(server.estimateYearlyEnergy(30)).toBeCloseTo(105120);
  });

  it('Calculates upstream emissions from direct', () => {
    expect(server.estimateYearlyUpstreamEmissions(80)).toBe(20);
  });
});

describe('Device type of network', () => {
  it('Calculates kWh of 1 network device', () => {
    expect(network.estimateYearlyEnergy(1)).toBeCloseTo(1314);
  });

  it('Calculates kWh of 30 desktops', () => {
    expect(network.estimateYearlyEnergy(30)).toBeCloseTo(39420);
  });

  it('Calculates upstream emissions from direct', () => {
    expect(network.estimateYearlyUpstreamEmissions(80)).toBe(20);
  });
});
