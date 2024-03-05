import { estimateEnergyEmissions } from './estimate-energy-emissions';

describe('Estimate Direct emissions', () => {
  it('Should estimate emissions using global average', () => {
    expect(estimateEnergyEmissions(1, 'global')).toBeCloseTo(0.494);
  });

  it('Should estimate emissions using us average', () => {
    expect(estimateEnergyEmissions(1, 'us')).toBeCloseTo(0.41);
  });

  it('Should estimate emissions using eu average', () => {
    expect(estimateEnergyEmissions(1, 'eu')).toBeCloseTo(0.33);
  });

  it('Should estimate emissions using uk average', () => {
    expect(estimateEnergyEmissions(1, 'uk')).toBeCloseTo(0.238);
  });
});
