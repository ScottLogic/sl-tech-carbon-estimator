import { Cloud } from '../carbon-estimator';
import { estimateCloudEmissions } from './estimate-cloud-emissions';

it('should return no emissions if cloud not used', () => {
  const input: Cloud = {
    noCloudServices: true,
    cloudPercentage: 100,
    monthlyCloudBill: '5000-10000',
    cloudLocation: 'global',
  };
  expect(estimateCloudEmissions(input)).toBe(0);
});

it('should return emissions based on ratio of costs', () => {
  const input: Cloud = {
    noCloudServices: false,
    cloudPercentage: 50,
    monthlyCloudBill: '0-200',
    cloudLocation: 'global',
  };
  expect(estimateCloudEmissions(input)).toBeCloseTo(11.367);
});
