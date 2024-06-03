import { DeviceCategory } from '../types/carbon-estimator';
import { KgCo2e } from '../types/units';
import { DeviceUsage } from './device-usage';
import { estimateUpstreamEmissions } from './estimate-upstream-emissions';

describe('estimateUpstreamEmissions', () => {
  function createUpstreamDeviceUsageStub(category: DeviceCategory, upstreamEmissions: KgCo2e): DeviceUsage {
    return {
      category: category,
      estimateDirectEmissions: () => 0,
      estimateUpstreamEmissions: () => upstreamEmissions,
    };
  }

  it('should return no emissions for an empty list', () => {
    expect(estimateUpstreamEmissions([])).toEqual({
      software: 0,
      employee: 0,
      server: 0,
      network: 0,
    });
  });

  it('should allocate emissions to relevant category', () => {
    const deviceUsage: DeviceUsage[] = [
      createUpstreamDeviceUsageStub('employee', 1),
      createUpstreamDeviceUsageStub('server', 2),
      createUpstreamDeviceUsageStub('network', 3),
    ];

    expect(estimateUpstreamEmissions(deviceUsage)).toEqual({
      software: 0,
      employee: 1,
      server: 2,
      network: 3,
    });
  });

  it('should total multiple emissions in the same category', () => {
    const deviceUsage: DeviceUsage[] = [
      createUpstreamDeviceUsageStub('employee', 1),
      createUpstreamDeviceUsageStub('employee', 2),
      createUpstreamDeviceUsageStub('employee', 3),
    ];
    expect(estimateUpstreamEmissions(deviceUsage)).toEqual({
      software: 0,
      employee: 6,
      server: 0,
      network: 0,
    });
  });
});
