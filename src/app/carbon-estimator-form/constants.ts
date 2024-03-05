import { EstimatorValues } from '../carbon-estimator';

export const defaultValues: Required<EstimatorValues> = {
  upstream: {
    headCount: 100,
    desktopToLaptopPercentage: 50,
  },
  onPrem: {
    location: 'global',
    numberOfServers: 0,
  },
  cloud: {
    location: 'global',
    cloudPercentage: 0,
    monthlyCloudBill: '0-200',
  },
  downstream: {
    customerLocation: 'global',
    monthlyActiveUsers: 100,
    mobilePercentage: 50,
    purposeOfSite: 'average',
  },
};
