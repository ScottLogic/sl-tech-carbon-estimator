import { ICO2Calculator, NumberOrCO2EstimateComponents } from "./ICO2Calculator";

export class FakeCO2Calculator implements ICO2Calculator {

  constructor(private readonly returnType: 'number' | 'object' = 'number') {}

  perByte(bytes: number): NumberOrCO2EstimateComponents {
    if (this.returnType === 'number') {
      return 0;
    } else {
      return { 
        consumerDeviceCO2: 1, 
        dataCenterCO2: 1, 
        networkCO2: 1, 
        productionCO2: 1, 
        total: 4
      };
    }
  }

  perVisit(bytes: number): NumberOrCO2EstimateComponents {
    return this.perByte(bytes);
  }
}