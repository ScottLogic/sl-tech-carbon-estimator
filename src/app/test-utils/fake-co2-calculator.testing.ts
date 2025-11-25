import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { FakeCO2Calculator } from '../facades/FakeCO2Calculator';

export const fakeCO2CalculatorFactory = () => {
  const instance = new FakeCO2Calculator();
  instance.setReturnType('object');
  return instance;
};

export const provideFakeCO2CalculatorMock = {
  provide: CO2_CALCULATOR,
  useFactory: fakeCO2CalculatorFactory,
};
