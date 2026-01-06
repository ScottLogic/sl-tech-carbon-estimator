import { FormControl, FormGroup } from '@angular/forms';
import { ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexStates, ApexTooltip } from 'ng-apexcharts';
import { KgCo2e } from './units';
import { Saas, SaasFormGroup } from '../features/saas/components/saas.constants';
import { Cloud, CloudFormGroup } from '../features/cloud/services/cloud-form.service';
import { Organisation, OrganisationFormGroup } from '../features/organisation/services/organisation-form.service';

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
  foundationModels: number;
  contentAndData: number;
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
  customer: number;
  networkTransfer: number;
  downstreamInfrastructure: number;
};

export type EstimatorValues = {
  upstream: Upstream;
  onPremise: OnPremise;
  cloud: Cloud;
  downstream: Downstream;
  saas: Saas;
};

export type EstimatorFormValues = {
  upstream: OrganisationFormGroup;
  onPremise: FormGroup<{
    estimateServerCount: FormControl<boolean>;
    serverLocation: FormControl<WorldLocation | 'unknown'>;
    numberOfServers: FormControl<number>;
  }>;
  cloud: CloudFormGroup;
  downstream: FormGroup<{
    noDownstream: FormControl<boolean>;
    customerLocation: FormControl<WorldLocation>;
    monthlyActiveUsers: FormControl<number>;
    mobilePercentage: FormControl<number>;
    purposeOfSite: FormControl<PurposeOfSite>;
  }>;
  saas: SaasFormGroup;
};

export type OnPremise = {
  estimateServerCount: boolean;
  serverLocation: WorldLocation;
  numberOfServers: number;
};

export type Upstream = Organisation;

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

export type JsonExport = {
  estimate: CarbonEstimation | undefined;
  input: EstimatorValues | undefined;
};
