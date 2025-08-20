import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CO2_CALCULATOR } from './facades/CO2InjectionToken';
import { CO2Calculator } from './facades/CO2Calculator';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(),
    {provide: CO2_CALCULATOR, useClass: CO2Calculator}
  ]
};
