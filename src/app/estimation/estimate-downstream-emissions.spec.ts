import { Downstream } from '../types/carbon-estimator';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';

it('should return no emissions if monthly active users is zero', () => {
  const input: Downstream = {
    monthlyActiveUsers: 0,
    customerLocation: 'global',
    mobilePercentage: 0,
    purposeOfSite: 'average',
  };
  expect(estimateDownstreamEmissions(input)).toEqual({
    endUser: 0,
    network: 0,
  });
});

it('should return emissions based on average values', () => {
  const input: Downstream = {
    monthlyActiveUsers: 100,
    customerLocation: 'global',
    mobilePercentage: 0,
    purposeOfSite: 'average',
  };
  const result = estimateDownstreamEmissions(input);
  expect(result.endUser).toBeCloseTo(302.839);
  expect(result.network).toBeCloseTo(249.601);
});
