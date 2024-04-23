import { estimateEnergyEmissions } from './estimate-energy-emissions';

describe('Estimate Direct emissions', () => {
  it('Should estimate emissions using global average', () => {
    expect(estimateEnergyEmissions(1, 'global')).toBeCloseTo(0.494);
  });

  it('Should estimate emissions using North America average', () => {
    expect(estimateEnergyEmissions(1, 'northAmerica')).toBeCloseTo(0.356);
  });

  it('Should estimate emissions using europe average', () => {
    expect(estimateEnergyEmissions(1, 'europe')).toBeCloseTo(0.33);
  });

  it('Should estimate emissions using uk average', () => {
    expect(estimateEnergyEmissions(1, 'uk')).toBeCloseTo(0.238);
  });
});
