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
  customElements.define('tech-carbon-estimator-inner', techCarbonEstimatorComponent);

  class ShadowTechCarbonEstimator extends HTMLElement {
    private estimatorInstance: HTMLElement | null = null;
    private shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });

      console.log('styles:', styles);
      const styleTag = document.createElement('style');
      styleTag.textContent = styles;
      this.shadow.appendChild(styleTag);
    }

    static get observedAttributes() {
      return techCarbonEstimatorComponent.observedAttributes;
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string) {
      if (this.estimatorInstance && typeof (this.estimatorInstance as any).attributeChangedCallback === 'function') {
        (this.estimatorInstance as any).attributeChangedCallback(name, oldValue, newValue);
      }
    }
    
    connectedCallback() {
      if (!this.estimatorInstance) {
        // Create the Angular custom element and append to shadow root
        this.estimatorInstance = document.createElement('tech-carbon-estimator-inner');
        this.shadow.appendChild(this.estimatorInstance);
      }
      if (this.estimatorInstance && typeof (this.estimatorInstance as any).connectedCallback === 'function') {
        (this.estimatorInstance as any).connectedCallback();
      }
    }

    disconnectedCallback() {
      if (this.estimatorInstance) {
        if (typeof (this.estimatorInstance as any).disconnectedCallback === 'function') {
          (this.estimatorInstance as any).disconnectedCallback();
        }
        this.shadow.removeChild(this.estimatorInstance);
        this.estimatorInstance = null;
      }
    }
  }

  customElements.define('tech-carbon-estimator', ShadowTechCarbonEstimator);

})();
