import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CarbonEstimatorComponent } from './app/carbon-estimator/carbon-estimator.component';

(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  // Define Web Components
  const carbonEstimatorComponent = createCustomElement(CarbonEstimatorComponent, { injector: app.injector });
  customElements.define('sl-carbon-estimator', carbonEstimatorComponent);
})();
