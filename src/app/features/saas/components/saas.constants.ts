import { FormGroup } from '@angular/forms';
import { FormContextSection } from '../../../carbon-estimator-form/carbon-estimator-form.constants';
import {
  defaultMicrosoft365Values,
  Microsoft365,
  Microsoft365FormValues as Microsoft365FormGroup,
} from './microsoft365-form/microsoft365.constants';

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

export type SaasFormGroup = FormGroup<{
  microsoft365: Microsoft365FormGroup;
}>;
