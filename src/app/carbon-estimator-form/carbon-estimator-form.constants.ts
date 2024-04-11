import { CostRange, EstimatorValues } from '../types/carbon-estimator';

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
  },
  onPremise: {
    estimateServerCount: false,
    serverLocation: 'global',
    numberOfServers: 10,
  },
  cloud: {
    noCloudServices: false,
    cloudLocation: 'global',
    cloudPercentage: 50,
    monthlyCloudBill: costRanges[4],
  },
  downstream: {
    customerLocation: 'global',
    monthlyActiveUsers: 10000,
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
    heading: 'Users',
    details:
      'Tell us about your users. At present we focus on the downstream impact of web based services, estimating an amount time spent in hours and of Data transferred in Gb per month.',
    formGroupName: 'downstream',
    location: {
      label: 'Where are your users primarily located?',
      helperText: 'end-user devices and network infrastructure',
      formControlName: 'customerLocation',
      hasUnknown: false,
    },
  },
};
