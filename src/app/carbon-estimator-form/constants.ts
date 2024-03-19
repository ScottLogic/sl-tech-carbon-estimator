import { EstimatorValues } from '../carbon-estimator';

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
    monthlyCloudBill: '0-200',
  },
  downstream: {
    customerLocation: 'global',
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
  },
  onPremise: {
    heading: 'On-Premise Servers',
    details:
      "We'll use the number of servers you use on-prem and their primary location to estimate the direct operational emissions. If this is unknown, we'll give an initial estimate based on the 10% of the number of employees. This is reduced based on the percentage of cloud services that you report you make use of.",
    formGroupName: 'onPremise',
    location: {
      label: 'Where are they primarily located?',
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
      formControlName: 'customerLocation',
      hasUnknown: false,
    },
  },
};

// TODO - update text was auto generated
export const helperTextStrings = {
  purposeOfSite:
    'Purpose of the site is used to determine the amount of mobile traffic. If the site is used for internal purposes, the mobile traffic will be lower. If the site is used for external purposes, the mobile traffic will be higher.',
};
