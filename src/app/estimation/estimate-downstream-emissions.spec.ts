import { TestBed } from '@angular/core/testing';
import { Downstream, DownstreamEstimation, PurposeOfSite, basePurposeArray } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { DownstreamEmissionsEstimator } from './estimate-downstream-emissions';
import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { FakeCO2Calculator } from '../facades/FakeCO2Calculator';
import { ICO2Calculator } from '../facades/ICO2Calculator';

let co2Calc: ICO2Calculator;
let estimator: DownstreamEmissionsEstimator;

describe('estimateDownstreamEmissions()', () => {
  beforeEach(() => {
    co2Calc = new FakeCO2Calculator('object');
    estimator = new DownstreamEmissionsEstimator(co2Calc);
  });

  const carbonIntensity = 500;

  it('should return no emissions if no downstream is requested', () => {
    const input: Downstream = {
      noDownstream: true,
      monthlyActiveUsers: 100,
      customerLocation: 'WORLD',
      mobilePercentage: 0,
      purposeOfSite: 'average',
    };

    expect(estimator.estimate(input, carbonIntensity)).toEqual({
      customer: 0,
      networkTransfer: 0,
      downstreamInfrastructure: 0,
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
    expect(actual.customer).withContext('customer').toBeCloseTo(expected.customer);
    expect(actual.networkTransfer).withContext('networkTransfer').toBeCloseTo(expected.networkTransfer);
  }

  it('should return emissions for information site', () => {
    const result = estimator.estimate(createInput('information'), carbonIntensity);
    expectEmissionsCloseTo(result, { customer: 0.51, networkTransfer: 9.372, downstreamInfrastructure: 0 });
  });

  it('should return emissions for e-commerce site', () => {
    const result = estimator.estimate(createInput('eCommerce'), carbonIntensity);
    expectEmissionsCloseTo(result, { customer: 3.18, networkTransfer: 198.72, downstreamInfrastructure: 0 });
  });

  it('should return emissions for social media site', () => {
    const result = estimator.estimate(createInput('socialMedia'), carbonIntensity);
    expectEmissionsCloseTo(result, { customer: 517.851, networkTransfer: 53331.6, downstreamInfrastructure: 0 });
  });

  it('should return emissions for streaming site', () => {
    const result = estimator.estimate(createInput('streaming'), carbonIntensity);
    expectEmissionsCloseTo(result, { customer: 703.48, networkTransfer: 124694.4, downstreamInfrastructure: 0 });
  });

  it('should return emissions based on average values', () => {
    const result = estimator.estimate(createInput('average'), carbonIntensity);
    expectEmissionsCloseTo(result, { customer: 306.25, networkTransfer: 44558.52, downstreamInfrastructure: 0 });
  });

  it('should create average equivalent to average of all other purposes', () => {
    const totalEmissions = basePurposeArray
      .map(purpose => sumValues(estimator.estimate(createInput(purpose), carbonIntensity)))
      .reduce((x, y) => x + y);
    const expectedAverage = totalEmissions / basePurposeArray.length;
    const result = estimator.estimate(createInput('average'), carbonIntensity);
    expect(sumValues(result)).toBeCloseTo(expectedAverage);
  });
});
