import { FormContextSection } from '../../../carbon-estimator-form/carbon-estimator-form.constants';
import { defaultMicrosoft365Values, Microsoft365 } from './microsoft365-form.component.html/microsoft365.constants';

export type Saas = {
  microsoft365: Microsoft365;
};

export const defaultSaasValues: Required<Saas> = {
  microsoft365: defaultMicrosoft365Values,
};

export const saasContext: FormContextSection = {
  heading: 'SaaS Services',
  details: 'Tell us about the SaaS services you use.',
  formGroupName: 'saas',
};
