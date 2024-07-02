import { InvalidatedPipe } from './invalidated.pipe';

describe('InvalidatedPipe', () => {
  it('create an instance', () => {
    const pipe = new InvalidatedPipe();
    expect(pipe).toBeTruthy();
  });

  const inputTestCases = [
    {
      testDescription: 'should return false if the control is valid and there has been no interaction',
      control: { valid: true, dirty: false, touched: false },
      expectedValue: false,
    },
    {
      testDescription: 'should return false if the control is valid and there has been interaction',
      control: { valid: true, dirty: true, touched: true },
      expectedValue: false,
    },
    {
      testDescription: 'should return false if the control is invalid and there has been no interaction',
      control: { valid: false, dirty: false, touched: false },
      expectedValue: false,
    },
    {
      testDescription: 'should return true if the control is invalid and is dirty',
      control: { valid: false, dirty: true, touched: false },
      expectedValue: true,
    },
    {
      testDescription: 'should return true if the control is invalid and has been touched',
      control: { valid: false, dirty: false, touched: true },
      expectedValue: true,
    },
  ];

  inputTestCases.forEach(testCase => {
    it(testCase.testDescription, () => {
      const control = jasmine.createSpyObj(
        'control',
        {},
        {
          valid: testCase.control.valid,
          invalid: !testCase.control.valid,
          pristine: !testCase.control.dirty,
          dirty: testCase.control.dirty,
          touched: testCase.control.touched,
        }
      );
      const pipe = new InvalidatedPipe();

      const transformed = pipe.transform(control);
      expect(transformed).toBe(testCase.expectedValue);
    });
  });
});
