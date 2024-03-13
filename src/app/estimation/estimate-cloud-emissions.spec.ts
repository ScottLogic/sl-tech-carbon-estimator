import { estimateCloudEmissions } from './estimate-cloud-emissions';

it('should return no emissions for zero cloud usage', () => {
  expect(estimateCloudEmissions(0, '5000-10000', 'global')).toBe(0);
});

it('should return emissions based on ratio of costs', () => {
  expect(estimateCloudEmissions(50, '0-200', 'global')).toBeCloseTo(11.367);
});
