import { InjectionToken } from '@angular/core';
import { ICO2Calculator } from './ICO2Calculator';

export interface Co2CalculatorOptions {
  model: '1byte' | 'swd';
  results: 'segment';
}

export const CO2_CONFIG = new InjectionToken<Co2CalculatorOptions>('CO2_CONFIG');
export const CO2_CALCULATOR = new InjectionToken<ICO2Calculator>('CO2_CALCULATOR');
