import { ExpansionPanelConfig } from '../expansion-panel/expansion-panel.constants';
import { CostRange, EstimatorValues, WorldLocation } from '../types/carbon-estimator';

export const costRanges: CostRange[] = [
  { min: 0, max: 1000 },
  { min: 1000, max: 2000 },
  { min: 2000, max: 5000 },
  { min: 5000, max: 10000 },
  { min: 10000, max: 20000 },
  { min: 20000, max: 50000 },
  { min: 50000, max: 100000 },
  { min: 100000, max: 200000 },
  { min: 200000, max: 500000 },
  { min: 500000, max: 1000000 },
  { min: 1000000, max: 2000000 },
  { min: 2000000, max: 5000000 },
];

export const defaultValues: Required<EstimatorValues> = {
  upstream: {
    headCount: 100,
    desktopPercentage: 50,
    employeeLocation: 'WORLD',
  },
  onPremise: {
    estimateServerCount: false,
    serverLocation: 'WORLD',
    numberOfServers: 10,
  },
  cloud: {
    noCloudServices: false,
    cloudLocation: 'WORLD',
    cloudPercentage: 50,
    monthlyCloudBill: costRanges[0],
  },
  downstream: {
    noDownstream: false,
    customerLocation: 'WORLD',
    monthlyActiveUsers: 100,
    mobilePercentage: 50,
    purposeOfSite: 'average',
  },
};

export const formContext = {
  upstream: {
    heading: 'Organisation',
    details:
      'To understand the scale of your emissions, we estimate based on the number of employees and the proportion of desktops to laptops specified. This may be an overestimate if a significant number of employees are not provided with devices, or an underestimate if they typically have more than one.',
    formGroupName: 'upstream',
    location: {
      label: 'Where are your employees primarily located?',
      helperText: 'your employee devices',
      formControlName: 'employeeLocation',
      hasUnknown: false,
    },
  },
  onPremise: {
    heading: 'On-Premise Servers',
    details:
      "We'll use the number of servers you use on-prem and their primary location to estimate the direct operational emissions. If this is unknown, we'll give an initial estimate based on the 10% of the number of employees. This is reduced based on the percentage of cloud services that you report you make use of.",
    formGroupName: 'onPremise',
    location: {
      label: 'Where are they primarily located?',
      helperText: 'your servers',
      formControlName: 'serverLocation',
      hasUnknown: true,
    },
  },
  cloud: {
    heading: 'Cloud Services',
    details: 'Tell us about your cloud services you use.',
    formGroupName: 'cloud',
    location: {
      label: 'Where are your cloud servers primarily located?',
      helperText: 'your cloud services',
      formControlName: 'cloudLocation',
      hasUnknown: true,
    },
  },
  downstream: {
    heading: 'End-Users',
    details:
      'Tell us about your end-users - this refers to any users of your digital services outside of your organisation. This includes visitors to your web sites, web applications and services like B2B API requests. At present we focus on the downstream impact of web based services, estimating an amount of time spent in hours and of Data transferred in GB per month.',
    formGroupName: 'downstream',
    location: {
      label: 'Where are your end-users primarily located?',
      helperText: 'end-user devices and network infrastructure',
      formControlName: 'customerLocation',
      hasUnknown: false,
    },
  },
};

export const questionPanelConfig: ExpansionPanelConfig = {
  startsExpanded: false,
  buttonStyles: 'material-icons-outlined tce-text-base hover:tce-bg-slate-200 hover:tce-rounded',
  contentContainerStyles: 'tce-px-3 tce-py-2 tce-bg-slate-100 tce-border tce-border-slate-400 tce-rounded tce-text-sm',
};

export const locationDescriptions: Record<WorldLocation, string> = {
  WORLD: 'Globally',
  'NORTH AMERICA': 'in North America',
  EUROPE: 'in Europe',
  GBR: 'in the UK',
  ASIA: 'in Asia',
  AFRICA: 'in Africa',
  OCEANIA: 'in Oceania',
  'LATIN AMERICA AND CARIBBEAN': 'in Latin America or the Caribbean',
};

export type ValidationError = {
  inputId: string;
  errorMessage: string;
};

export const errorConfig = {
  headCount: {
    inputId: 'headCount',
    errorMessage: 'The number of employees must be greater than 0',
  },
  numberOfServers: {
    inputId: 'numberOfServers',
    errorMessage: 'The number of servers must be greater than or equal to 0',
  },
  monthlyActiveUsers: {
    inputId: 'monthlyActiveUsers',
    errorMessage: 'The number of monthly active users must be greater than 0',
  },
};

export type ControlState = {
  dirty: boolean;
  touched: boolean;
};
