import { co2 } from '@tgwf/co2';
import { CO2EstimateTraceResultPerByte, ICO2Calculator, NumberOrCO2EstimateComponents } from './ICO2Calculator';
import { Injectable, inject } from '@angular/core';
import { CO2_CONFIG, Co2CalculatorOptions } from './CO2InjectionToken';

@Injectable()
export class CO2Calculator implements ICO2Calculator {
  private options = inject<Co2CalculatorOptions>(CO2_CONFIG, { optional: true });

  private calculator: InstanceType<typeof co2> = new co2(this.options ?? { model: 'swd', results: 'segment' });

  perByte(bytes: number): NumberOrCO2EstimateComponents {
    return this.calculator.perByte(bytes);
  }

  perByteTrace(bytes: number, green?: boolean | undefined, options?: unknown): CO2EstimateTraceResultPerByte {
    return this.calculator.perByteTrace(bytes, green, options);
  }

  perVisit(bytes: number): NumberOrCO2EstimateComponents {
    return this.calculator.perVisit(bytes);
  }
}
