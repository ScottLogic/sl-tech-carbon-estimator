import { Component } from '@angular/core';
import { CLOUD_AVERAGE_PUE, ON_PREMISE_AVERAGE_PUE } from '../estimation/constants';
import { siteTypeInfo } from '../estimation/estimate-downstream-emissions';
import { PurposeOfSite, WorldLocation, locationArray, purposeOfSiteArray } from '../types/carbon-estimator';
import { DecimalPipe } from '@angular/common';
import { CarbonIntensityService } from '../services/carbon-intensity.service';
import { desktop, laptop, mobile, monitor, network, server, tablet } from '../estimation/device-type';
import { ExternalLinkDirective } from '../directives/external-link.directive';

const purposeDescriptions: Record<PurposeOfSite, string> = {
  information: 'Information',
  eCommerce: 'E-Commerce',
  socialMedia: 'Social Media',
  streaming: 'Streaming',
  average: 'Average',
};

const locationDescriptions: Record<WorldLocation, string> = {
  WORLD: 'Global',
  'NORTH AMERICA': 'North America',
  EUROPE: 'Europe',
  GBR: 'United Kingdom',
  ASIA: 'Asia',
  AFRICA: 'Africa',
  OCEANIA: 'Oceania',
  'LATIN AMERICA AND CARIBBEAN': 'Latin America and Caribbean',
};

@Component({
  selector: 'assumptions-and-limitation',
  standalone: true,
  templateUrl: './assumptions-and-limitation.component.html',
  imports: [DecimalPipe, ExternalLinkDirective],
})
export class AssumptionsAndLimitationComponent {
  readonly ON_PREMISE_AVERAGE_PUE = ON_PREMISE_AVERAGE_PUE;
  readonly CLOUD_AVERAGE_PUE = CLOUD_AVERAGE_PUE;
  readonly siteTypeInfo = purposeOfSiteArray.map(purpose => ({
    type: purposeDescriptions[purpose],
    time: siteTypeInfo[purpose].averageMonthlyUserTime,
    data: siteTypeInfo[purpose].averageMonthlyUserData,
  }));
  readonly locationCarbonInfo;
  readonly deviceInfo = [
    {
      name: 'Laptop',
      info: laptop,
    },
    {
      name: 'Desktop',
      info: desktop,
    },
    {
      name: 'Server',
      info: server,
    },
    {
      name: 'Network',
      info: network,
    },
    {
      name: 'Mobile',
      info: mobile,
    },
    {
      name: 'Tablet',
      info: tablet,
    },
    {
      name: 'Monitor',
      info: monitor,
    },
  ];

  constructor(private intensityService: CarbonIntensityService) {
    this.locationCarbonInfo = locationArray.map(location => ({
      location: locationDescriptions[location],
      carbonIntensity: this.intensityService.getCarbonIntensity(location),
    }));
  }
}
