import { laptop } from './device-type';
import { createDeviceUsage } from './device-usage';
import { estimateEnergyEmissions } from './estimate-energy-emissions';

describe('createDeviceUsage()', () => {
  it('should expose device category', () => {
    expect(createDeviceUsage(laptop, 'user', 'WORLD', 0).category).toBe('user');
    expect(createDeviceUsage(laptop, 'server', 'WORLD', 0).category).toBe('server');
    expect(createDeviceUsage(laptop, 'network', 'WORLD', 0).category).toBe('network');
  });

  it('should estimate upstream emissions using device type', () => {
    spyOn(laptop, 'estimateYearlyUpstreamEmissions').and.callFake(() => 42);
    const deviceCount = 10;
    const usage = createDeviceUsage(laptop, 'user', 'WORLD', deviceCount);

    expect(usage.estimateUpstreamEmissions()).toBe(42);
    expect(laptop.estimateYearlyUpstreamEmissions).toHaveBeenCalledOnceWith(deviceCount);
  });

  it('should estimate direct emissions using device type and location', () => {
    spyOn(laptop, 'estimateYearlyEnergy').and.callFake(() => 42);
    const deviceCount = 100;
    const usage = createDeviceUsage(laptop, 'user', 'WORLD', deviceCount);

    const expectedEmissions = estimateEnergyEmissions(42, 'WORLD');
    expect(usage.estimateDirectEmissions()).toBe(expectedEmissions);
    expect(laptop.estimateYearlyEnergy).toHaveBeenCalledOnceWith(deviceCount);
  });

  it('should apply pue to energy estimation if specified', () => {
    spyOn(laptop, 'estimateYearlyEnergy').and.callFake(() => 42);
    const deviceCount = 1000;
    const pue = 2;
    const usage = createDeviceUsage(laptop, 'user', 'WORLD', deviceCount, pue);

    const expectedEmissions = estimateEnergyEmissions(84, 'WORLD');
    expect(usage.estimateDirectEmissions()).toBe(expectedEmissions);
    expect(laptop.estimateYearlyEnergy).toHaveBeenCalledOnceWith(deviceCount);
  });
});
