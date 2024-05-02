import { estimateEnergyEmissions } from './estimate-energy-emissions';

describe('Estimate Direct emissions', () => {
  it('Should estimate emissions using global average', () => {
    expect(estimateEnergyEmissions(1, 'WORLD')).toBeCloseTo(0.494);
  });

  it('Should estimate emissions using North America average', () => {
    expect(estimateEnergyEmissions(1, 'NORTH AMERICA')).toBeCloseTo(0.378);
  });

  it('Should estimate emissions using europe average', () => {
    expect(estimateEnergyEmissions(1, 'EUROPE')).toBeCloseTo(0.33);
  });

  it('Should estimate emissions using uk average', () => {
    expect(estimateEnergyEmissions(1, 'GBR')).toBeCloseTo(0.256);
  });
});
