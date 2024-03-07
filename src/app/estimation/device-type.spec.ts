import { laptop, desktop, server, network } from './device-type';

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
    expect(network.estimateYearlyEnergy(1)).toBeCloseTo(1314);
  });

  it('Estimates kWh of 30 desktops', () => {
    expect(network.estimateYearlyEnergy(30)).toBeCloseTo(39420);
  });

  it('Estimates upstream emissions of 1 network device', () => {
    expect(network.estimateYearlyUpstreamEmissions(1)).toBeCloseTo(250);
  });
});
