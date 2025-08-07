import { TestBed } from '@angular/core/testing';

import { CarbonEstimationUtilService } from './carbon-estimation-util.service';

describe('CarbonEstimationUtilService', () => {
  let service: CarbonEstimationUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonEstimationUtilService);
  });

  it('should round numbers and add a percentage sign', () => {
    expect(service.getPercentageLabel(1)).toBe('1%');
    expect(service.getPercentageLabel(1.5)).toBe('2%');
    expect(service.getPercentageLabel(1.499)).toBe('1%');
  });

  it('should return <1% when the percentage is less than 1', () => {
    expect(service.getPercentageLabel(0.999)).toBe('<1%');
  });

  it('should sum the values of an object and return a percentage string', () => {
    const emissions = { a: 10, b: 25, c: 1 };
    expect(service.getOverallPercentageLabel(emissions)).toBe('36%');

    const emissions2 = { a: 0.1, b: 0.2, c: 0.5 };
    expect(service.getOverallPercentageLabel(emissions2)).toBe('<1%');
  });

  it('should return the correct label and svg for a given key', () => {
    expect(service.getLabelAndSvg('software')).toEqual({ label: 'Software - Off the Shelf', svg: 'web-logo' });
    expect(service.getLabelAndSvg('saas')).toEqual({ label: 'SaaS', svg: 'web-logo' });
    expect(service.getLabelAndSvg('employee', 'Upstream Emissions Estimate')).toEqual({
      label: 'Employee Hardware',
      svg: 'devices-logo',
    });
    expect(service.getLabelAndSvg('endUser')).toEqual({ label: 'End-User Devices', svg: 'devices-logo' });
    expect(service.getLabelAndSvg('network', 'Direct Emissions Estimate')).toEqual({
      label: 'Networking and Infrastructure',
      svg: 'router-logo',
    });
    expect(service.getLabelAndSvg('server', 'Direct Emissions Estimate')).toEqual({
      label: 'Servers and Storage',
      svg: 'storage-logo',
    });
    expect(service.getLabelAndSvg('managed')).toEqual({ label: 'Managed Services', svg: 'storage-logo' });
    expect(service.getLabelAndSvg('cloud')).toEqual({ label: 'Cloud Services', svg: 'cloud-logo' });
    expect(service.getLabelAndSvg('networkTransfer')).toEqual({
      label: 'Network Data Transfer',
      svg: 'cell-tower-logo',
    });
    expect(service.getLabelAndSvg('unknown')).toEqual({ label: 'Unknown', svg: '' });
  });
});
