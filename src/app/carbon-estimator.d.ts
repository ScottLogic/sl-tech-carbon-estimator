import { FormControl, FormGroup } from '@angular/forms';

export type CarbonEstimation = {
  version: string;
  upstreamEmissions: number;
  cloudEmissions: number;
  directEmissions: number;
  downstreamEmissions: number;
};

export type EstimatorValues = {
  upstream?: Upstream;
  onPrem?: OnPrem;
  cloud?: Cloud;
  downstream?: Downstream;
};

export type EstimatorFormValues = {
  upstream: FormGroup<{
    enabled: FormControl<boolean>;
    headCount: FormControl<number>;
    desktopToLaptopPercentage: FormControl<number>;
  }>;
  onPrem: FormGroup<{
    enabled: FormControl<boolean>;
    location: FormControl<WorldLocation>;
    numberOfServers: FormControl<number>;
  }>;
  cloud: FormGroup<{
    enabled: FormControl<boolean>;
    location: FormControl<WorldLocation>;
    cloudPercentage: FormControl<number>;
    monthlyCloudBill: FormControl<MonthlyCloudBill>;
  }>;
  downstream: FormGroup<{
    enabled: FormControl<boolean>;
    customerLocation: FormControl<WorldLocation>;
    monthlyActiveUsers: FormControl<number>;
    mobilePercentage: FormControl<number>;
    purposeOfSite: FormControl<PurposeOfSite>;
  }>;
};

type FormSection<T> = T & { enabled: boolean };

export type OnPrem = {
  location: WorldLocation;
  numberOfServers: number;
};
export type Upstream = {
  headCount: number;
  desktopToLaptopPercentage: number;
};
export type Cloud = {
  location: WorldLocation;
  cloudPercentage: number;
  monthlyCloudBill: MonthlyCloudBill;
};
export type Downstream = {
  customerLocation: WorldLocation;
  monthlyActiveUsers: number;
  mobilePercentage: number;
  purposeOfSite: PurposeOfSite;
};

export const locationArray = ['global', 'uk', 'eu', 'us'] as const;
export type WorldLocation = (typeof locationArray)[number];

export const monthlyCloudBillArray = [
  '0-200',
  '200-500',
  '500-1000',
  '1000-5000',
  '5000-10000',
  '10000-50000',
] as const;
export type MonthlyCloudBill = (typeof monthlyCloudBillArray)[number];

export const purposeOfSiteArray = ['streaming', 'information', 'eCommerce', 'socialMedia', 'average'] as const;
export type PurposeOfSite = (typeof purposeOfSiteArray)[number];
