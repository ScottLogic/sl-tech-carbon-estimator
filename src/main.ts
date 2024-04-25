import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { TechCarbonEstimatorComponent } from './app/tech-carbon-estimator/tech-carbon-estimator.component';
import { TechCarbonEstimationsComponent } from './app/tech-carbon-estimations/tech-carbon-estimations.component';

(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  // Define Web Components
  const techCarbonEstimatorComponent = createCustomElement(TechCarbonEstimatorComponent, { injector: app.injector });
  const techCarbonEstimationsComponent = createCustomElement(TechCarbonEstimationsComponent, {
    injector: app.injector,
  });
  customElements.define('tech-carbon-estimator', techCarbonEstimatorComponent);
  customElements.define('tech-carbon-estimations', techCarbonEstimationsComponent);
})();
