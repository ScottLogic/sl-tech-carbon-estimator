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
      employee: 0,
      server: 0,
      network: 0,
    });
  });

  it('should allocate emissions to relevant category', () => {
    const deviceUsage: DeviceUsage[] = [
      createDirectDeviceUsageStub('employee', 1),
      createDirectDeviceUsageStub('server', 2),
      createDirectDeviceUsageStub('network', 3),
    ];

    expect(estimateDirectEmissions(deviceUsage)).toEqual({
      employee: 1,
      server: 2,
      network: 3,
    });
  });

  it('should total multiple emissions in the same category', () => {
    const deviceUsage: DeviceUsage[] = [
      createDirectDeviceUsageStub('employee', 1),
      createDirectDeviceUsageStub('employee', 2),
      createDirectDeviceUsageStub('employee', 3),
    ];
    expect(estimateDirectEmissions(deviceUsage)).toEqual({
      employee: 6,
      server: 0,
      network: 0,
    });
  });
});
