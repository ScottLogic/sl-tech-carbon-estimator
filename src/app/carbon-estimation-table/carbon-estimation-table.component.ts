import { Component, computed, effect, input } from '@angular/core';
import { CarbonEstimation } from '../types/carbon-estimator';
import {
  EmissionsColours,
  EmissionsLabels,
  placeholderTableData,
} from '../carbon-estimation/carbon-estimation.constants';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';
import { NumberObject } from '../utils/number-object';
import { NgClass, NgStyle } from '@angular/common';

export type TableItem = {
  category: string;
  emissions: string;
  parent?: string;
  svg?: string;
  colour: ItemColour;
  display?: boolean;
};

type ItemColour = {
  svg?: string;
  background: string;
};

@Component({
  selector: 'carbon-estimation-table',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './carbon-estimation-table.component.html',
})
export class CarbonEstimationTableComponent {
  public carbonEstimation = input<CarbonEstimation>();

  public tableData = computed(() => this.getTableData(this.carbonEstimation()));

  public expanded: { [key: string]: boolean } = {
    [EmissionsLabels.Upstream]: true,
    [EmissionsLabels.Direct]: true,
    [EmissionsLabels.Indirect]: true,
    [EmissionsLabels.Downstream]: true,
  };

  constructor(private carbonEstimationUtilService: CarbonEstimationUtilService) {}

  public toggle(category: string): void {
    this.tableData().forEach(emission => {
      if (emission.parent === category) {
        emission.display = !emission.display;
      }
    });
    this.expanded[category] = !this.expanded[category];
  }

  public getTableData(carbonEstimation?: CarbonEstimation): TableItem[] {
    return !carbonEstimation ? placeholderTableData : (
        [
          {
            category: EmissionsLabels.Upstream,
            emissions: this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.upstreamEmissions),
            colour: { background: EmissionsColours.Upstream },
          },
          ...this.getEmissionsBreakdown(
            carbonEstimation.upstreamEmissions,
            EmissionsLabels.Upstream,
            EmissionsColours.Upstream,
            EmissionsColours.UpstreamLight,
            this.expanded[EmissionsLabels.Upstream]
          ),
          {
            category: EmissionsLabels.Direct,
            emissions: this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.directEmissions),
            colour: { background: EmissionsColours.Direct },
          },
          ...this.getEmissionsBreakdown(
            carbonEstimation.directEmissions,
            EmissionsLabels.Direct,
            EmissionsColours.Direct,
            EmissionsColours.OperationLight,
            this.expanded[EmissionsLabels.Direct]
          ),
          {
            category: EmissionsLabels.Indirect,
            emissions: this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.indirectEmissions),
            colour: { background: EmissionsColours.Indirect },
          },
          ...this.getEmissionsBreakdown(
            carbonEstimation.indirectEmissions,
            EmissionsLabels.Indirect,
            EmissionsColours.Indirect,
            EmissionsColours.OperationLight,
            this.expanded[EmissionsLabels.Indirect]
          ),
          {
            category: EmissionsLabels.Downstream,
            emissions: this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.downstreamEmissions),
            colour: { background: EmissionsColours.Downstream },
          },
          ...this.getEmissionsBreakdown(
            carbonEstimation.downstreamEmissions,
            EmissionsLabels.Downstream,
            EmissionsColours.Downstream,
            EmissionsColours.DownstreamLight,
            this.expanded[EmissionsLabels.Downstream]
          ),
        ]
      );
  }

  private getEmissionsBreakdown(
    emissions: NumberObject,
    parent: string,
    svgColour: string,
    backgroundColour: string,
    display = true
  ): TableItem[] {
    return (
      Object.entries(emissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([_key, value]) =>
          this.getTableItem(_key, value, parent, { background: backgroundColour, svg: svgColour }, display)
        )
    );
  }

  private getTableItem(key: string, value: number, parent: string, colour: ItemColour, display: boolean): TableItem {
    const { label, svg } = this.carbonEstimationUtilService.getLabelAndSvg(key, parent);
    return {
      category: label,
      emissions: this.carbonEstimationUtilService.getPercentageLabel(value),
      parent,
      svg,
      colour,
      display,
    };
  }
}
