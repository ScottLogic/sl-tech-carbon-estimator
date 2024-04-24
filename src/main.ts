import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { TechCarbonEstimatorComponent } from './app/tech-carbon-estimator/tech-carbon-estimator.component';

(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  // Define Web Components
  const techCarbonEstimatorComponent = createCustomElement(TechCarbonEstimatorComponent, { injector: app.injector });
  customElements.define('tech-carbon-estimator', techCarbonEstimatorComponent);
})();
