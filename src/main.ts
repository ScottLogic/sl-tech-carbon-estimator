import { bootstrapApplication, createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { CarbonEstimatorComponent } from './app/carbon-estimator/carbon-estimator.component';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';

// bootstrapApplication(CarbonEstimatorComponent, appConfig)
//   .catch((err) => console.error(err));

(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  // Define Web Components
  const myLibraryComponent = createCustomElement(CarbonEstimatorComponent, {injector: app.injector});
  customElements.define('app-carbon-estimator', myLibraryComponent);
})();
