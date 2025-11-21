import { co2 } from '@tgwf/co2';

export type NumberOrCO2EstimateComponents = ReturnType<InstanceType<typeof co2>['perByte']>;

export type CO2EstimateTraceResultPerByte = ReturnType<InstanceType<typeof co2>['perByteTrace']>;

export interface ICO2Calculator {
  perByte(bytes: number): NumberOrCO2EstimateComponents;

  perByteTrace(bytes: number, green?: boolean | undefined, options?: any): CO2EstimateTraceResultPerByte;

  perVisit(bytes: number): NumberOrCO2EstimateComponents;
}
