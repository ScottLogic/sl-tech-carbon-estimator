import { estimateEnergyEmissions } from './estimate-energy-emissions';

describe('estimateEnergyEmissions()', () => {
  it('Should estimate emissions using carbon intensity and convert to Kg', () => {
    expect(estimateEnergyEmissions(1, 494)).toBeCloseTo(0.494);
    expect(estimateEnergyEmissions(1000, 378)).toBeCloseTo(378);
  });
});
