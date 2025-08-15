import { co2 } from "@tgwf/co2";

export type NumberOrCO2EstimateComponents = ReturnType<InstanceType<typeof co2>['perByte']>;

export interface ICO2Calculator {
  perByte(bytes: number): NumberOrCO2EstimateComponents;

  perVisit(bytes: number): NumberOrCO2EstimateComponents;
}