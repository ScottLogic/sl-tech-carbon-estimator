import { FormatCostRangePipe } from './format-cost-range.pipe';

describe('FormatCostRangePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatCostRangePipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform()', () => {
    it('formats ranges under 1000', () => {
      const pipe = new FormatCostRangePipe();
      const transformed = pipe.transform({ min: 0, max: 200 });
      expect(transformed).toBe('$0 - $200');
    });

    it('formats ranges over 1000 and less than a million', () => {
      const pipe = new FormatCostRangePipe();
      const transformed = pipe.transform({ min: 1000, max: 999000 });
      expect(transformed).toBe('$1K - $999K');
    });

    it('formats ranges over a million', () => {
      const pipe = new FormatCostRangePipe();
      const transformed = pipe.transform({ min: 1000000, max: 2000000 });
      expect(transformed).toBe('$1M - $2M');
    });
  });
});
