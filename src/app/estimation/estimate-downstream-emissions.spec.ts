import { Downstream, DownstreamEstimation, PurposeOfSite, basePurposeArray } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';

describe('estimateDownstreamEmissions()', () => {
  const carbonIntensity = 500;

  it('should return no emissions if no downstream is requested', () => {
    const input: Downstream = {
      noDownstream: true,
      monthlyActiveUsers: 100,
      customerLocation: 'WORLD',
      mobilePercentage: 0,
      purposeOfSite: 'average',
    };
    expect(estimateDownstreamEmissions(input, carbonIntensity)).toEqual({
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
    const result = estimateDownstreamEmissions(createInput('information'), carbonIntensity);
    expectEmissionsCloseTo(result, { endUser: 0.51, networkTransfer: 0.05 });
  });

  it('should return emissions for e-commerce site', () => {
    const result = estimateDownstreamEmissions(createInput('eCommerce'), carbonIntensity);
    expectEmissionsCloseTo(result, { endUser: 3.18, networkTransfer: 1.1 });
  });

  it('should return emissions for social media site', () => {
    const result = estimateDownstreamEmissions(createInput('socialMedia'), carbonIntensity);
    expectEmissionsCloseTo(result, { endUser: 517.851, networkTransfer: 296.41 });
  });

  it('should return emissions for streaming site', () => {
    const result = estimateDownstreamEmissions(createInput('streaming'), carbonIntensity);
    expectEmissionsCloseTo(result, { endUser: 703.48, networkTransfer: 693.03 });
  });

  it('should return emissions based on average values', () => {
    const result = estimateDownstreamEmissions(createInput('average'), carbonIntensity);
    expectEmissionsCloseTo(result, { endUser: 306.25, networkTransfer: 247.65 });
  });

  it('should create average equivalent to average of all other purposes', () => {
    const totalEmissions = basePurposeArray
      .map(purpose => sumValues(estimateDownstreamEmissions(createInput(purpose), carbonIntensity)))
      .reduce((x, y) => x + y);
    const expectedAverage = totalEmissions / basePurposeArray.length;
    const result = estimateDownstreamEmissions(createInput('average'), carbonIntensity);
    expect(sumValues(result)).toBeCloseTo(expectedAverage);
  });
});
