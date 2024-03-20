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
      helperText:
        'This will affect the average <a class="underline" href="https://www.techcarbonstandard.org/glossary#carbon-intensity">Carbon Intensity</a> of the energy used by your servers.',
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
      helperText:
        'This will affect the average <a class="underline" href="https://www.techcarbonstandard.org/glossary#carbon-intensity">Carbon Intensity</a> of the energy used by your cloud services.',
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
      helperText:
        'This will affect the average <a class="underline" href="https://www.techcarbonstandard.org/glossary#carbon-intensity">Carbon Intensity</a> of the energy used by end-user devices and network infrastructure.',
      formControlName: 'customerLocation',
      hasUnknown: false,
    },
  },
};

// TODO - update text was auto generated
export const helperTextStrings = {
  mobilePercentage:
    'The percentage of mobile users will affect the energy used by end user devices and network infrastructure.<br>While the power demand of mobile devices is often much lower, the use of mobile networks can increase the power used when transferring data.',
  purposeOfSite:
    'The purpose of the site is used to determine the typical amount of time a user might spend on your site and the amount of data that may be transferred.<br>This can affect the amount of energy used by end user devices and how much energy from network traffic is attributable to your site',
};
