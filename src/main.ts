import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { TechCarbonEstimatorComponent } from './app/tech-carbon-estimator/tech-carbon-estimator.component';
import styles from './styles.generated.css';

(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  // Define Web Components
  const techCarbonEstimatorComponent = createCustomElement(TechCarbonEstimatorComponent, {
     injector: app.injector
  });

  class ShadowTechCarbonEstimator extends HTMLElement {
    private estimatorInstance: InstanceType<typeof techCarbonEstimatorComponent> | null = null;

    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      
      // Create Angular custom element and append to shadow root
      this.estimatorInstance = new techCarbonEstimatorComponent();
      shadow.appendChild(this.estimatorInstance);

      const styleTag = document.createElement('style');
      styleTag.textContent = styles;
      shadow.appendChild(styleTag);
    }

    static get observedAttributes() {
      return techCarbonEstimatorComponent.observedAttributes;
    }
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string) {
      if (this.estimatorInstance && typeof this.estimatorInstance.attributeChangedCallback === 'function') {
        this.estimatorInstance.attributeChangedCallback(name, oldValue, newValue);
      }
    }
    connectedCallback() {
      if (this.estimatorInstance && typeof this.estimatorInstance.connectedCallback === 'function') {
        this.estimatorInstance.connectedCallback();
      }
    }
    disconnectedCallback() {
      if (this.estimatorInstance && typeof this.estimatorInstance.disconnectedCallback === 'function') {
        this.estimatorInstance.disconnectedCallback();
      }
    }
  }

  customElements.define('tech-carbon-estimator', ShadowTechCarbonEstimator);

})();
