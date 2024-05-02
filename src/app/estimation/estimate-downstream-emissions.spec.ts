import { Downstream, DownstreamEstimation, PurposeOfSite, basePurposeArray } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';

describe('estimateDownstreamEmissions()', () => {
  it('should return no emissions if no downstream is requested', () => {
    const input: Downstream = {
      noDownstream: true,
      monthlyActiveUsers: 100,
      customerLocation: 'WORLD',
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
      customerLocation: 'WORLD',
      mobilePercentage: 0,
      purposeOfSite: purposeOfSite,
    };
  }

  function expectEmissionsCloseTo(actual: DownstreamEstimation, expected: DownstreamEstimation) {
    expect(actual.endUser).withContext('endUser').toBeCloseTo(expected.endUser);
    expect(actual.networkTransfer).withContext('networkTransfer').toBeCloseTo(expected.networkTransfer);
  }

  it('should return emissions for information site', () => {
    const result = estimateDownstreamEmissions(createInput('information'));
    expectEmissionsCloseTo(result, { endUser: 0.5, networkTransfer: 0.05 });
  });

  it('should return emissions for e-commerce site', () => {
    const result = estimateDownstreamEmissions(createInput('eCommerce'));
    expectEmissionsCloseTo(result, { endUser: 3.13888, networkTransfer: 1.11322 });
  });

  it('should return emissions for social media site', () => {
    const result = estimateDownstreamEmissions(createInput('socialMedia'));
    expectEmissionsCloseTo(result, { endUser: 511.55, networkTransfer: 298.71 });
  });

  it('should return emissions for streaming site', () => {
    const result = estimateDownstreamEmissions(createInput('streaming'));
    expectEmissionsCloseTo(result, { endUser: 694.93, networkTransfer: 698.42 });
  });

  it('should return emissions based on average values', () => {
    const result = estimateDownstreamEmissions(createInput('average'));
    expectEmissionsCloseTo(result, { endUser: 302.53, networkTransfer: 249.57 });
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
