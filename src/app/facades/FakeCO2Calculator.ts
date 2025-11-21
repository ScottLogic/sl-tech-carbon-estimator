import { Injectable } from '@angular/core';
import { CO2EstimateTraceResultPerByte, ICO2Calculator, NumberOrCO2EstimateComponents } from './ICO2Calculator';
import { Injectable } from '@angular/core';
import { CO2EstimateTraceResultPerByte, ICO2Calculator, NumberOrCO2EstimateComponents } from './ICO2Calculator';

@Injectable()
export class FakeCO2Calculator implements ICO2Calculator {
  private readonly returnType: 'number' | 'object' = 'object';

  constructor() {}

  perByte(bytes: number): NumberOrCO2EstimateComponents {
    if (this.returnType === 'number') {
      return 0;
    } else {
      return {
        consumerDeviceCO2: 1,
        dataCenterCO2: 1,
        networkCO2: 1,
        productionCO2: 1,
        total: 4,
      };
    }
  }

  perByteTrace(bytes: number, green?: boolean | undefined, options?: any): CO2EstimateTraceResultPerByte {
    return {
      co2:
        this.returnType == 'number' ?
          0
        : {
            networkCO2: bytes / 100000,
            dataCenterCO2: 0,
            consumerDeviceCO2: 0,
            productionCO2: 0,
            total: 0,
          },
      green: green ?? false,
      variables: {
        gridIntensity: {
          description: '',
          network: 0,
          dataCenter: 0,
          device: 0,
          production: 0,
        },
      },
    };
  }

  perVisit(bytes: number): NumberOrCO2EstimateComponents {
    return this.perByte(bytes);
  }
}
