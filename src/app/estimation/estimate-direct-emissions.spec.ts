import { DeviceCategory } from '../types/carbon-estimator';
import { KgCo2e } from '../types/units';
import { DeviceUsage } from './device-usage';
import { estimateDirectEmissions } from './estimate-direct-emissions';

describe('estimateDirectEmissions', () => {
  function createDirectDeviceUsageStub(category: DeviceCategory, directEmissions: KgCo2e): DeviceUsage {
    return {
      category: category,
      estimateDirectEmissions: () => directEmissions,
      estimateUpstreamEmissions: () => 0,
    };
  }

  it('should return no emissions for an empty list', () => {
    expect(estimateDirectEmissions([])).toEqual({
      user: 0,
      server: 0,
      network: 0,
    });
  });

  it('should allocate emissions to relevant category', () => {
    const deviceUsage: DeviceUsage[] = [
      createDirectDeviceUsageStub('user', 1),
      createDirectDeviceUsageStub('server', 2),
      createDirectDeviceUsageStub('network', 3),
    ];

    expect(estimateDirectEmissions(deviceUsage)).toEqual({
      user: 1,
      server: 2,
      network: 3,
    });
  });

  it('should total multiple emissions in the same category', () => {
    const deviceUsage: DeviceUsage[] = [
      createDirectDeviceUsageStub('user', 1),
      createDirectDeviceUsageStub('user', 2),
      createDirectDeviceUsageStub('user', 3),
    ];
    expect(estimateDirectEmissions(deviceUsage)).toEqual({
      user: 6,
      server: 0,
      network: 0,
    });
  });
});
