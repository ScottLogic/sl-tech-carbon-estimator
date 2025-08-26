import { TestBed } from '@angular/core/testing';
import { Downstream, DownstreamEstimation, PurposeOfSite, basePurposeArray } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { estimateDownstreamEmissions } from './estimate-downstream-emissions';
import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { FakeCO2Calculator } from '../facades/FakeCO2Calculator';
import { ICO2Calculator } from '../facades/ICO2Calculator';

let co2Calc: ICO2Calculator

describe('estimateDownstreamEmissions()', () => {
  beforeEach(() => {
    co2Calc = new FakeCO2Calculator('object');
  })

  const carbonIntensity = 500;

  it('should return no emissions if no downstream is requested', () => {
    const input: Downstream = {
      noDownstream: true,
      monthlyActiveUsers: 100,
      customerLocation: 'WORLD',
      mobilePercentage: 0,
      purposeOfSite: 'average',
    };
    
    expect(estimateDownstreamEmissions(input, carbonIntensity, co2Calc)).toEqual({
      endUser: 0,
      networkTransfer: 0,
      downstreamInfrastructure: 0
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
    const result = estimateDownstreamEmissions(createInput('information'), carbonIntensity, co2Calc);
    expectEmissionsCloseTo(result, { endUser: 0.51, networkTransfer: 9.372, downstreamInfrastructure: 0 });
  });

  it('should return emissions for e-commerce site', () => {
    const result = estimateDownstreamEmissions(createInput('eCommerce'), carbonIntensity, co2Calc);
    expectEmissionsCloseTo(result, { endUser: 3.18, networkTransfer: 198.72, downstreamInfrastructure: 0});
  });

  it('should return emissions for social media site', () => {
    const result = estimateDownstreamEmissions(createInput('socialMedia'), carbonIntensity, co2Calc);
    expectEmissionsCloseTo(result, { endUser: 517.851, networkTransfer: 53331.6, downstreamInfrastructure: 0 });
  });

  it('should return emissions for streaming site', () => {
    const result = estimateDownstreamEmissions(createInput('streaming'), carbonIntensity, co2Calc);
    expectEmissionsCloseTo(result, { endUser: 703.48, networkTransfer: 124694.40, downstreamInfrastructure: 0 });
  });

  it('should return emissions based on average values', () => {
    const result = estimateDownstreamEmissions(createInput('average'), carbonIntensity, co2Calc);
    expectEmissionsCloseTo(result, { endUser: 306.25, networkTransfer: 44558.52, downstreamInfrastructure: 0 });
  });

  it('should create average equivalent to average of all other purposes', () => {
    const totalEmissions = basePurposeArray
      .map(purpose => sumValues(estimateDownstreamEmissions(createInput(purpose), carbonIntensity, co2Calc)))
      .reduce((x, y) => x + y);
    const expectedAverage = totalEmissions / basePurposeArray.length;
    const result = estimateDownstreamEmissions(createInput('average'), carbonIntensity, co2Calc);
    expect(sumValues(result)).toBeCloseTo(expectedAverage);
  });
});
