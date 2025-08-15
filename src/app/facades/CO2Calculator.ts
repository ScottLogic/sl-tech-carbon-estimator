import { co2 } from "@tgwf/co2";
import { ICO2Calculator, NumberOrCO2EstimateComponents } from "./ICO2Calculator";

export class CO2Calculator implements ICO2Calculator {
  private calculator: InstanceType<typeof co2>;

  constructor(options?: {model? : '1byte' | 'swd'}) {
    this.calculator = new co2(options);
  }

  perByte(bytes: number): NumberOrCO2EstimateComponents {
    return this.calculator.perByte(bytes);
  }

  perVisit(bytes: number): NumberOrCO2EstimateComponents {
    return this.calculator.perVisit(bytes);
  }
}