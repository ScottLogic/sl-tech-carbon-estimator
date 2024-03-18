import { FormControl, FormGroup } from '@angular/forms';

export type CarbonEstimation = {
  version: string;
  upstreamEmissions: number;
  cloudEmissions: number;
  directEmissions: number;
  downstreamEmissions: number;
};

export type EstimatorValues = {
  upstream: Upstream;
  onPremise: OnPremise;
  cloud: Cloud;
  downstream: Downstream;
};

export type EstimatorFormValues = {
  upstream: FormGroup<{
    headCount: FormControl<number>;
    desktopPercentage: FormControl<number>;
  }>;
  onPremise: FormGroup<{
    serverLocation: FormControl<WorldLocation | 'unknown'>;
    numberOfServers: FormControl<number>;
  }>;
  cloud: FormGroup<{
    noCloudServices: FormControl<boolean>;
    cloudLocation: FormControl<WorldLocation | 'unknown'>;
    cloudPercentage: FormControl<number>;
    monthlyCloudBill: FormControl<MonthlyCloudBill>;
  }>;
  downstream: FormGroup<{
    customerLocation: FormControl<WorldLocation>;
    monthlyActiveUsers: FormControl<number>;
    mobilePercentage: FormControl<number>;
    purposeOfSite: FormControl<PurposeOfSite>;
  }>;
};

export type OnPremise = {
  serverLocation: WorldLocation;
  numberOfServers: number;
};
export type Upstream = {
  headCount: number;
  desktopPercentage: number;
};
export type Cloud = {
  noCloudServices: boolean;
  cloudLocation: WorldLocation;
  cloudPercentage: number;
  monthlyCloudBill: MonthlyCloudBill;
};
export type Downstream = {
  customerLocation: WorldLocation;
  monthlyActiveUsers: number;
  mobilePercentage: number;
  purposeOfSite: PurposeOfSite;
};
export type DeviceCounts = {
  desktopCount: number;
  laptopCount: number;
  serverCount: number;
  networkCount: number;
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
