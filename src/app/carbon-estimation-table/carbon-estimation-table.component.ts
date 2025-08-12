import { ChangeDetectorRef, Component, computed, input } from '@angular/core';
import { CarbonEstimation } from '../types/carbon-estimator';
import { EmissionsColours, EmissionsLabels } from '../carbon-estimation/carbon-estimation.constants';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';
import { NumberObject } from '../utils/number-object';
import { NgClass, NgStyle } from '@angular/common';

export type TableItem = TableItemLevel1 | TableItemLevel2;

type TableItemLevel1 = { level: 1; expanded: boolean; expandable: boolean } & BaseTableItem;
type TableItemLevel2 = { level: 2; parent: string; svg: string } & BaseTableItem;
type BaseTableItem = {
  category: string;
  emissionsValue: string;
  emissionsPercentage: string;
  colour: ItemColour;
  display: boolean;
  positionInSet: number;
  setSize: number;
};

type ItemColour = {
  svg?: string;
  background: string;
};

type ArrowDirection = ArrowDirectionHorizontal | ArrowDirectionVertical;

type ArrowDirectionHorizontal = 'left' | 'right';
type ArrowDirectionVertical = 'up' | 'down';

@Component({
  selector: 'carbon-estimation-table',
  standalone: true,
  imports: [],
  templateUrl: './carbon-estimation-table.component.html',
})
export class CarbonEstimationTableComponent {
  public carbonEstimation = input<CarbonEstimation>();

  public tableData = computed(() => this.getTableData(this.carbonEstimation()));

  private expandedState: { [key: string]: boolean } = {};

  constructor(
    private carbonEstimationUtilService: CarbonEstimationUtilService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public toggle(category: string): void {
    this.tableData().forEach(emission => {
      if (emission.level === 2 && emission.parent === category) {
        emission.display = !emission.display;
      } else if (emission.level === 1 && emission.category === category) {
        emission.expanded = !emission.expanded;
        this.expandedState[category] = emission.expanded;
      }
    });
  }

  public parentRowArrowKeyBoardEvent(
    keyBoardEvent: Event,
    direction: ArrowDirectionHorizontal,
    parent: string,
    expanded: boolean
  ): void {
    if (
      keyBoardEvent.target === keyBoardEvent.currentTarget &&
      ((direction === 'left' && expanded) || (direction === 'right' && !expanded))
    ) {
      keyBoardEvent.preventDefault();
      this.toggle(parent);
    } else {
      this.arrowKeyBoardEvent(keyBoardEvent, direction);
    }
  }

  public arrowKeyBoardEvent(keyBoardEvent: Event, direction: ArrowDirection): void {
    keyBoardEvent.preventDefault();
    const tagName = (keyBoardEvent.target as HTMLElement).tagName;

    if (tagName === 'TR') {
      this.moveRowFocus(keyBoardEvent, direction);
    } else if (tagName === 'TD') {
      this.moveCellFocus(keyBoardEvent, direction);
    }
  }

  public homeEndKeyBoardEvent(event: Event): void {
    const keyBoardEvent = event as KeyboardEvent;
    const isHomeKey = keyBoardEvent.key === 'Home';
    keyBoardEvent.preventDefault();
    const tagName = (keyBoardEvent.target as HTMLElement).tagName;

    if (tagName === 'TR') {
      // Row is focused
      const target = keyBoardEvent.target as HTMLTableRowElement;
      const table = target.parentElement as HTMLTableElement;
      const newRow = isHomeKey ? table.rows[0] : this.getLastVisibleRow(table);
      this.setNewTabIndexAndFocus(newRow, target);
    } else if (tagName === 'TD') {
      // Cell is focused
      const target = keyBoardEvent.target as HTMLTableCellElement;
      const row = target.parentElement as HTMLTableRowElement;

      if (keyBoardEvent.ctrlKey) {
        const table = row.parentElement as HTMLTableElement;
        const newRow = isHomeKey ? table.rows[0] : this.getLastVisibleRow(table);
        const newCell = newRow.cells[target.cellIndex];
        this.setNewTabIndexAndFocus(newRow, row, false);
        this.setNewTabIndexAndFocus(newCell, target);
      } else {
        const newCell = isHomeKey ? row.cells[0] : row.cells[row.cells.length - 1];
        this.setNewTabIndexAndFocus(newCell, target);
      }
    }
  }

  private moveRowFocus(keyBoardEvent: Event, direction: ArrowDirection): void {
    if (direction === 'right') {
      this.moveFocusToCell(keyBoardEvent);
    } else if (direction === 'down' || direction === 'up') {
      this.moveRowFocusVertically(keyBoardEvent, direction);
    }
  }

  private moveFocusToCell(keyBoardEvent: Event): void {
    const target = keyBoardEvent.target as HTMLElement;
    const cell = target.firstElementChild as HTMLElement;
    cell.tabIndex = 0;
    this.changeDetector.detectChanges();
    cell.focus();
  }

  private moveRowFocusVertically(keyBoardEvent: Event, direction: ArrowDirectionVertical): void {
    const target = keyBoardEvent.target as HTMLElement;
    const newRow = this.findNextVisibleRow(target as HTMLTableRowElement, direction);
    if (newRow) {
      this.setNewTabIndexAndFocus(newRow, target);
    }
  }

  private moveCellFocus(keyBoardEvent: Event, direction: ArrowDirection): void {
    const target = keyBoardEvent.target as HTMLTableCellElement;
    const currentRow = target.parentElement as HTMLTableRowElement;
    let newCell: HTMLTableCellElement | undefined = undefined;
    let newRow: HTMLTableRowElement | undefined = undefined;

    if (direction === 'left') {
      newCell = target.previousElementSibling as HTMLTableCellElement;
    } else if (direction === 'right') {
      newCell = target.nextElementSibling as HTMLTableCellElement;
    } else if (direction === 'up' || direction === 'down') {
      newRow = this.findNextVisibleRow(currentRow, direction);
      newCell = newRow?.cells[target.cellIndex] as HTMLTableCellElement;
    }

    if (newCell) {
      if (newRow) {
        this.setNewTabIndexAndFocus(newRow, currentRow, false);
      }
      this.setNewTabIndexAndFocus(newCell, target);
    } else if (direction === 'left') {
      this.moveFocusToRow(keyBoardEvent);
    }
  }

  private moveFocusToRow(keyBoardEvent: Event): void {
    const target = keyBoardEvent.target as HTMLElement;
    const row = target.parentElement as HTMLElement;
    target.tabIndex = -1;
    this.changeDetector.detectChanges();
    row.focus();
  }

  private findNextVisibleRow(
    row: HTMLTableRowElement,
    direction: ArrowDirectionVertical
  ): HTMLTableRowElement | undefined {
    const newRow = (direction === 'up' ? row.previousElementSibling : row.nextElementSibling) as HTMLTableRowElement;
    return newRow?.classList.contains('tce:hidden') ? this.findNextVisibleRow(newRow, direction) : newRow;
  }

  private getLastVisibleRow(table: HTMLTableElement): HTMLTableRowElement {
    const rows = Array.from(table.rows);
    const lastVisibleRow = rows.reverse().find(row => !row.classList.contains('tce:hidden'));
    return lastVisibleRow as HTMLTableRowElement;
  }

  private setNewTabIndexAndFocus(newElement: HTMLElement, oldElement: HTMLElement, setFocus = true): void {
    oldElement.tabIndex = -1;
    newElement.tabIndex = 0;
    if (setFocus) {
      newElement.focus();
    }
  }

  private getTableData(carbonEstimation?: CarbonEstimation): TableItem[] {
    return !carbonEstimation ?
        []
      : [
          ...this.getParentTableItems(
            EmissionsLabels.Upstream,
            carbonEstimation.values.upstreamEmissions,
            carbonEstimation.percentages.upstreamEmissions,
            EmissionsColours.Upstream,
            EmissionsColours.UpstreamLight,
            1,
            4,
            this.expandedState[EmissionsLabels.Upstream]
          ),
          ...this.getParentTableItems(
            EmissionsLabels.Direct,
            carbonEstimation.values.directEmissions,
            carbonEstimation.percentages.directEmissions,
            EmissionsColours.Direct,
            EmissionsColours.OperationLight,
            2,
            4,
            this.expandedState[EmissionsLabels.Direct]
          ),
          ...this.getParentTableItems(
            EmissionsLabels.Indirect,
            carbonEstimation.values.indirectEmissions,
            carbonEstimation.percentages.indirectEmissions,
            EmissionsColours.Indirect,
            EmissionsColours.OperationLight,
            3,
            4,
            this.expandedState[EmissionsLabels.Indirect]
          ),
          ...this.getParentTableItems(
            EmissionsLabels.Downstream,
            carbonEstimation.values.downstreamEmissions,
            carbonEstimation.percentages.downstreamEmissions,
            EmissionsColours.Downstream,
            EmissionsColours.DownstreamLight,
            4,
            4,
            this.expandedState[EmissionsLabels.Downstream]
          ),
          {
            level: 1,
            expanded: false,
            expandable: false,
            category: 'Total Emissions Estimate',
            emissionsValue: this.carbonEstimationUtilService.getAbsoluteValueLabel(
              carbonEstimation.values.totalEmissions
            ),
            emissionsPercentage: this.carbonEstimationUtilService.getPercentageLabel(
              100
            ),
            colour: { background: EmissionsColours.Total },
            display: true,
            positionInSet: 5,
            setSize: 1,
          },
        ];
  }

  private getEmissionsBreakdown(
    values: NumberObject,
    percentages: NumberObject,
    parent: string,
    svgColour: string,
    backgroundColour: string,
    display = true
  ): TableItem[] {
    return (
      Object.entries(values)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([key, value], index, array) =>
          this.getChildTableItem(
            key,
            value,
            percentages[key],
            parent,
            { background: backgroundColour, svg: svgColour },
            display,
            index + 1,
            array.length
          )
        )
    );
  }

  private getParentTableItems(
    label: string,
    value: NumberObject,
    percentage: NumberObject,
    parentColour: string,
    childColour: string,
    positionInSet: number,
    setSize: number,
    expanded: boolean = true
  ): TableItem[] {
    return [
      {
        category: label,
        emissionsValue: this.carbonEstimationUtilService.getOverallAbsoluteValueLabel(value),
        emissionsPercentage: this.carbonEstimationUtilService.getOverallPercentageLabel(percentage),
        colour: { background: parentColour },
        display: true,
        expanded,
        expandable: true,
        positionInSet,
        setSize,
        level: 1,
      },
      ...this.getEmissionsBreakdown(value, percentage, label, parentColour, childColour, expanded),
    ];
  }

  private getChildTableItem(
    key: string,
    value: number,
    percentage: number,
    parent: string,
    colour: ItemColour,
    display: boolean,
    positionInSet: number,
    setSize: number
  ): TableItem {
    const { label, svg } = this.carbonEstimationUtilService.getLabelAndSvg(key, parent);
    return {
      category: label,
      emissionsValue: this.carbonEstimationUtilService.getAbsoluteValueLabel(value),
      emissionsPercentage: this.carbonEstimationUtilService.getPercentageLabel(percentage),
      parent,
      svg,
      colour,
      display,
      positionInSet,
      setSize,
      level: 2,
    };
  }
}
