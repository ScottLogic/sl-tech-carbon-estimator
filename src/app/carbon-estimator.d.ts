export type CarbonEstimation = {
  upstreamEmissions?: number;
  cloudEmissions?: number;
  directEmissions?: number;
  downstreamEmissions?: number;
};

export type EstimatorValues = {
  upstream?: Upstream;
  onPrem?: OnPrem;
  cloud?: Cloud;
  downstream?: Downstream;
};

export type EstimatorFormValues = {
  upstream: FormSection<Upstream>;
  onPrem: FormSection<OnPrem>;
  cloud: FormSection<Cloud>;
  downstream: FormSection<Downstream>;
};

type FormSection<T> = T & { enabled: boolean };

export type OnPrem = {
  location: Location;
  numberOfServers: number;
};
export type Upstream = {
  headCount: number;
  desktopToLaptopPercentage: number;
};
export type Cloud = {
  location: Location;
  cloudPercentage: number;
  monthlyCloudBill: MonthlyCloudBill;
};
export type Downstream = {
  customerLocation: Location;
  monthlyActiveUsers: number;
  mobilePercentage: number;
  purposeOfSite: PurposeOfSite;
};

export const locationArray = ['global', 'uk', 'eu', 'us'] as const;
export type Location = (typeof locationArray)[number];

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
