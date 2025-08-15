import { ICO2Calculator } from "../facades/ICO2Calculator";
import { CO2Calculator } from "../facades/CO2Calculator";
import { FakeCO2Calculator } from "../facades/FakeCO2Calculator";
import {environment} from "../../environments/environment";

export function createCo2Calculator(): ICO2Calculator {
  const isProduction = environment.production;
  const fakeMode = environment.co2FakeMode as 'number' | 'object' | undefined;

  // test environment -> use fake
  if(!isProduction) {
    if(fakeMode === 'object') {
      return new FakeCO2Calculator('object');
    }

    // default to number mode if no explicit fake mode
    return new FakeCO2Calculator('number');
  }

  // production / dev -> real lib
  return new CO2Calculator({model: 'swd'});
}