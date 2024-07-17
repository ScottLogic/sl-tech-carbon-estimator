import { Component, effect, input } from '@angular/core';
import { CarbonEstimation } from '../types/carbon-estimator';
import { EmissionsColours, EmissionsLabels } from '../carbon-estimation/carbon-estimation.constants';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';
import { NumberObject } from '../utils/number-object';
import { NgClass, NgStyle } from '@angular/common';

type TableItem = {
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
  public carbonEstimation = input.required<CarbonEstimation>();
  public emissions: TableItem[] = [];

  public expanded: { [key: string]: boolean } = {
    [EmissionsLabels.Upstream]: true,
    [EmissionsLabels.Direct]: true,
    [EmissionsLabels.Indirect]: true,
    [EmissionsLabels.Downstream]: true,
  };

  constructor(private carbonEstimationUtilService: CarbonEstimationUtilService) {
    effect(() => {
      this.emissions = this.getEmissions(this.carbonEstimation());
    });
  }

  public toggle(category: string): void {
    this.emissions.forEach(emission => {
      if (emission.parent === category) {
        emission.display = !emission.display;
      }
    });
    this.expanded[category] = !this.expanded[category];
  }

  public getEmissions(carbonEstimation: CarbonEstimation): TableItem[] {
    return [
      {
        category: EmissionsLabels.Upstream,
        emissions: this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.upstreamEmissions),
        colour: { background: EmissionsColours.Upstream },
      },
      ...this.getEmissionsBreakdown(
        carbonEstimation.upstreamEmissions,
        EmissionsLabels.Upstream,
        EmissionsColours.Upstream,
        EmissionsColours.UpstreamLight
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
        EmissionsColours.OperationLight
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
        EmissionsColours.OperationLight
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
        EmissionsColours.DownstreamLight
      ),
    ];
  }

  private getEmissionsBreakdown(
    emissions: NumberObject,
    parent: string,
    svgColour: string,
    backgroundColour: string
  ): TableItem[] {
    return (
      Object.entries(emissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([_key, value]) =>
          this.getTableItem(_key, value, parent, { background: backgroundColour, svg: svgColour })
        )
    );
  }

  private getTableItem(key: string, value: number, parent: string, colour: ItemColour): TableItem {
    const { label, svg } = this.carbonEstimationUtilService.getLabelAndSvg(key, parent);
    return {
      category: label,
      emissions: this.carbonEstimationUtilService.getPercentageLabel(value),
      parent,
      svg,
      colour,
      display: true,
    };
  }
}
