import { Downstream } from '../carbon-estimator';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';

it('should return no emissions if no downstream info provided', () => {
  expect(estimateDownstreamEmissions()).toBe(0);
});

it('should return no emissions if monthly active users is zero', () => {
  const input: Downstream = {
    monthlyActiveUsers: 0,
    customerLocation: 'global',
    mobilePercentage: 0,
    purposeOfSite: 'average',
  };
  expect(estimateDownstreamEmissions(input)).toBe(0);
});

it('should return emissions based on average values', () => {
  const input: Downstream = {
    monthlyActiveUsers: 100,
    customerLocation: 'global',
    mobilePercentage: 0,
    purposeOfSite: 'average',
  };
  expect(estimateDownstreamEmissions(input)).toBeCloseTo(552.439);
});
