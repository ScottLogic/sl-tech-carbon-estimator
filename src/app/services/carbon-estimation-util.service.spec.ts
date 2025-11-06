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

  it('should return mass values with round numbers and a kg unit', () => {
    expect(service.getAbsoluteValueLabel(1)).toBe('1 kg');
    expect(service.getAbsoluteValueLabel(1.5)).toBe('2 kg');
    expect(service.getAbsoluteValueLabel(1.499)).toBe('1 kg');
  });

  it('should return <1% when the percentage is less than 1', () => {
    expect(service.getPercentageLabel(0.999)).toBe('<1%');
  });

  it('should return <1 kg when the absolute value is less than 1', () => {
    expect(service.getAbsoluteValueLabel(0.999)).toBe('<1 kg');
  });

  it('should sum the percentages of an object and return a percentage string', () => {
    const emissions = { a: 10, b: 25, c: 1 };
    expect(service.getOverallPercentageLabel(emissions)).toBe('36%');

    const emissions2 = { a: 0.1, b: 0.2, c: 0.5 };
    expect(service.getOverallPercentageLabel(emissions2)).toBe('<1%');
  });

  it('should sum the values of an object and return an absolute value string', () => {
    const emissions = { a: 10, b: 25, c: 1 };
    expect(service.getOverallAbsoluteValueLabel(emissions)).toBe('36 kg');

    const emissions2 = { a: 0.1, b: 0.2, c: 0.5 };
    expect(service.getOverallAbsoluteValueLabel(emissions2)).toBe('<1 kg');
  });

  it('should return the correct label and svg for a given key', () => {
    expect(service.getLabelAndSvg('software')).toEqual({ label: 'Software - Off the Shelf', svg: 'web-logo' });
    expect(service.getLabelAndSvg('saas')).toEqual({ label: 'SaaS', svg: 'web-logo' });
    expect(service.getLabelAndSvg('employee', 'Upstream Emissions Estimate')).toEqual({
      label: 'Employee Hardware',
      svg: 'devices-logo',
    });
    expect(service.getLabelAndSvg('customer')).toEqual({ label: 'Customer Devices', svg: 'devices-logo' });
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
