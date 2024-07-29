import { Injectable } from '@angular/core';
import { NumberObject, sumValues } from '../utils/number-object';
import { startCase } from 'lodash-es';
import { SVG, tooltipFormatter } from '../carbon-estimation/carbon-estimation.constants';

@Injectable({
  providedIn: 'root',
})
export class CarbonEstimationUtilService {
  constructor() {}

  public getOverallPercentageLabel = (emissions: NumberObject): string => {
    const percentage = sumValues(emissions);
    return this.getPercentageLabel(percentage);
  };

  public getPercentageLabel = tooltipFormatter;

  public getLabelAndSvg(key: string, parent: string = ''): { label: string; svg: string } {
    switch (key) {
      case 'software':
        return { label: 'Software - Off the Shelf', svg: SVG.WEB };
      case 'saas':
        return { label: 'SaaS', svg: SVG.WEB };
      case 'employee':
        return { label: this.getEmployeeLabel(parent), svg: SVG.DEVICES };
      case 'endUser':
        return { label: 'End-User Devices', svg: SVG.DEVICES };
      case 'network':
        return { label: this.getNetworkLabel(parent), svg: SVG.ROUTER };
      case 'server':
        return { label: this.getServerLabel(parent), svg: SVG.STORAGE };
      case 'managed':
        return { label: 'Managed Services', svg: SVG.STORAGE };
      case 'cloud':
        return { label: 'Cloud Services', svg: SVG.CLOUD };
      case 'networkTransfer':
        return { label: 'Network Data Transfer', svg: SVG.CELL_TOWER };
      default:
        return { label: startCase(key), svg: '' };
    }
  }

  private getEmployeeLabel(key: string): string {
    switch (key) {
      case 'Upstream Emissions':
        return 'Employee Hardware';
      case 'Direct Emissions':
        return 'Employee Devices';
      default:
        return startCase(key);
    }
  }

  private getNetworkLabel(key: string): string {
    switch (key) {
      case 'Upstream Emissions':
        return 'Networking and Infrastructure Hardware';
      case 'Direct Emissions':
        return 'Networking and Infrastructure';
      default:
        return startCase(key);
    }
  }

  private getServerLabel(key: string): string {
    switch (key) {
      case 'Upstream Emissions':
        return 'Servers and Storage Hardware';
      case 'Direct Emissions':
        return 'Servers and Storage';
      default:
        return startCase(key);
    }
  }
}
