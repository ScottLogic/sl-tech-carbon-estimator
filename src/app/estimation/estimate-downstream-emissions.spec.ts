import { Downstream } from '../types/carbon-estimator';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';

describe('estimateDownstreamEmissions', () => {
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

  it('should return emissions for information site', () => {
    const input: Downstream = {
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: 'information',
    };
    const result = estimateDownstreamEmissions(input);
    expect(result.endUser).toBeCloseTo(0.50222);
    expect(result.network).toBeCloseTo(0.0525016);
  });

  it('should return emissions for e-commerce site', () => {
    const input: Downstream = {
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: 'eCommerce',
    };
    const result = estimateDownstreamEmissions(input);
    expect(result.endUser).toBeCloseTo(3.13888);
    expect(result.network).toBeCloseTo(1.11322);
  });

  it('should return emissions for social media site', () => {
    const input: Downstream = {
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: 'socialMedia',
    };
    const result = estimateDownstreamEmissions(input);
    expect(result.endUser).toBeCloseTo(511.637);
    expect(result.network).toBeCloseTo(298.761);
  });

  it('should return emissions for streaming site', () => {
    const input: Downstream = {
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: 'streaming',
    };
    const result = estimateDownstreamEmissions(input);
    expect(result.endUser).toBeCloseTo(695.038);
    expect(result.network).toBeCloseTo(698.533);
  });

  it('should return emissions based on average values', () => {
    const input: Downstream = {
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: 'average',
    };
    const result = estimateDownstreamEmissions(input);
    expect(result.endUser).toBeCloseTo(302.579);
    expect(result.network).toBeCloseTo(249.615);
  });
});
