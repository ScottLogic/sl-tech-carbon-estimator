import { Downstream, PurposeOfSite, basePurposeArray } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';

describe('estimateDownstreamEmissions', () => {
  it('should return no emissions if no downstream is requested', () => {
    const input: Downstream = {
      noDownstream: true,
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: 'average',
    };
    expect(estimateDownstreamEmissions(input)).toEqual({
      endUser: 0,
      networkTransfer: 0,
    });
  });

  function createInput(purposeOfSite: PurposeOfSite): Downstream {
    return {
      noDownstream: false,
      monthlyActiveUsers: 100,
      customerLocation: 'global',
      mobilePercentage: 0,
      purposeOfSite: purposeOfSite,
    };
  }

  it('should return emissions for information site', () => {
    const result = estimateDownstreamEmissions(createInput('information'));
    expect(result.endUser).toBeCloseTo(0.50222);
    expect(result.networkTransfer).toBeCloseTo(0.0525016);
  });

  it('should return emissions for e-commerce site', () => {
    const result = estimateDownstreamEmissions(createInput('eCommerce'));
    expect(result.endUser).toBeCloseTo(3.13888);
    expect(result.networkTransfer).toBeCloseTo(1.11322);
  });

  it('should return emissions for social media site', () => {
    const result = estimateDownstreamEmissions(createInput('socialMedia'));
    expect(result.endUser).toBeCloseTo(511.637);
    expect(result.networkTransfer).toBeCloseTo(298.761);
  });

  it('should return emissions for streaming site', () => {
    const result = estimateDownstreamEmissions(createInput('streaming'));
    expect(result.endUser).toBeCloseTo(695.038);
    expect(result.networkTransfer).toBeCloseTo(698.533);
  });

  it('should return emissions based on average values', () => {
    const result = estimateDownstreamEmissions(createInput('average'));
    expect(result.endUser).toBeCloseTo(302.579);
    expect(result.networkTransfer).toBeCloseTo(249.615);
  });

  it('should create average equivalent to average of all other purposes', () => {
    const totalEmissions = basePurposeArray
      .map(purpose => sumValues(estimateDownstreamEmissions(createInput(purpose))))
      .reduce((x, y) => x + y);
    const expectedAverage = totalEmissions / basePurposeArray.length;
    const result = estimateDownstreamEmissions(createInput('average'));
    expect(sumValues(result)).toBeCloseTo(expectedAverage);
  });
});
