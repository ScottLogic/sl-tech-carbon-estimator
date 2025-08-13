import { FormControl, FormGroup } from '@angular/forms';
import { ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexStates, ApexTooltip } from 'ng-apexcharts';
import { KgCo2e } from './units';

export type CarbonEstimation = {
  values: CarbonEstimationValues;
  percentages: CarbonEstimationPercentages;
};

export type CarbonEstimationPercentages = {
  version: string;
  upstreamEmissions: UpstreamEstimation;
  indirectEmissions: IndirectEstimation;
  directEmissions: DirectEstimation;
  downstreamEmissions: DownstreamEstimation;
};

export type CarbonEstimationValues = {
  version: string;
  upstreamEmissions: UpstreamEstimation;
  indirectEmissions: IndirectEstimation;
  directEmissions: DirectEstimation;
  downstreamEmissions: DownstreamEstimation;
  totalEmissions: KgCo2e;
};

export type UpstreamEstimation = {
  software: number;
  employee: number;
  network: number;
  server: number;
};
export type IndirectEstimation = {
  cloud: number;
  saas: number;
  managed: number;
};
export type DirectEstimation = {
  employee: number;
  network: number;
  server: number;
};
export type DownstreamEstimation = {
  endUser: number;
  networkTransfer: number;
  downstreamInfrastructure: number;
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
    employeeLocation: FormControl<WorldLocation>;
  }>;
  onPremise: FormGroup<{
    estimateServerCount: FormControl<boolean>;
    serverLocation: FormControl<WorldLocation | 'unknown'>;
    numberOfServers: FormControl<number>;
  }>;
  cloud: FormGroup<{
    noCloudServices: FormControl<boolean>;
    cloudLocation: FormControl<WorldLocation | 'unknown'>;
    cloudPercentage: FormControl<number>;
    monthlyCloudBill: FormControl<CostRange>;
  }>;
  downstream: FormGroup<{
    noDownstream: FormControl<boolean>;
    customerLocation: FormControl<WorldLocation>;
    monthlyActiveUsers: FormControl<number>;
    mobilePercentage: FormControl<number>;
    purposeOfSite: FormControl<PurposeOfSite>;
  }>;
};

export type OnPremise = {
  estimateServerCount: boolean;
  serverLocation: WorldLocation;
  numberOfServers: number;
};
export type Upstream = {
  headCount: number;
  desktopPercentage: number;
  employeeLocation: WorldLocation;
};
export type Cloud = {
  noCloudServices: boolean;
  cloudLocation: WorldLocation;
  cloudPercentage: number;
  monthlyCloudBill: CostRange;
};
export type Downstream = {
  noDownstream: boolean;
  customerLocation: WorldLocation;
  monthlyActiveUsers: number;
  mobilePercentage: number;
  purposeOfSite: PurposeOfSite;
};

export type DeviceCategory = 'employee' | 'server' | 'network';

export const locationArray = [
  'WORLD',
  'GBR',
  'EUROPE',
  'NORTH AMERICA',
  'ASIA',
  'AFRICA',
  'OCEANIA',
  'LATIN AMERICA AND CARIBBEAN',
] as const;
export type WorldLocation = (typeof locationArray)[number];

export type CostRange = {
  min: number;
  max: number;
};

export const basePurposeArray = ['information', 'eCommerce', 'socialMedia', 'streaming'] as const;
export type BasePurposeOfSite = (typeof basePurposeArray)[number];

export const purposeOfSiteArray = [...basePurposeArray, 'average'] as const;
export type PurposeOfSite = (typeof purposeOfSiteArray)[number];

export type ChartOptions = {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  dataLabels: ApexDataLabels;
};
