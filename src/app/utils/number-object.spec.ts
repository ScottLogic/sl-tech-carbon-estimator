import { multiplyValues, sumValues } from './number-object';

const basicObject = {
  any: 1,
  random: 2,
  property: 3,
};

const anotherObject = {
  here: 4,
  are: 5,
  more: 6,
};

type TestType = {
  more: number;
  properties: number;
};

describe('sumValues', () => {
  it('should sum numerical values in any object', () => {
    expect(sumValues(basicObject)).toBe(6);
    expect(sumValues(anotherObject)).toBe(15);
  });
});

describe('multiplyValues', () => {
  it('should multiply all values in the input object', () => {
    expect(multiplyValues(basicObject, 2)).toEqual({ any: 2, random: 4, property: 6 });
  });
  it('should retain input type', () => {
    const input: TestType = {
      more: 4,
      properties: 5,
    };
    const output: TestType = multiplyValues(input, 3);
    expect(output).toEqual({ more: 12, properties: 15 });
  });
});
