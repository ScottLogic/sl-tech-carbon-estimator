import { ChangeDetectorRef, Component, computed, input } from '@angular/core';
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
  colour: ItemColour;
  display: boolean;
  positionInSet: number;
  setSize: number;
  parent?: string;
  svg?: string;
  expanded?: boolean;
  level: number;
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
  imports: [NgStyle, NgClass],
  templateUrl: './carbon-estimation-table.component.html',
})
export class CarbonEstimationTableComponent {
  public carbonEstimation = input<CarbonEstimation>();

  public tableData = computed(() => this.getTableData(this.carbonEstimation()));

  constructor(
    private carbonEstimationUtilService: CarbonEstimationUtilService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public toggle(category: string): void {
    this.tableData().forEach(emission => {
      if (emission.parent === category) {
        emission.display = !emission.display;
      } else if (emission.category === category) {
        emission.expanded = !emission.expanded;
      }
    });
  }

  public parentRowArrowKeyBoardEvent(
    keyBoardEvent: Event,
    direction: ArrowDirectionHorizontal,
    parent: string,
    expanded?: boolean
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

  public homeEndKeyBoardEvent(event: Event, home: boolean): void {
    const keyBoardEvent = event as KeyboardEvent;
    keyBoardEvent.preventDefault();
    const tagName = (keyBoardEvent.target as HTMLElement).tagName;

    if (tagName === 'TR') {
      // Row is focused
      const target = keyBoardEvent.target as HTMLTableRowElement;
      const table = target.parentElement as HTMLTableElement;
      const newRow = home ? table.rows[0] : this.getLastVisibleRow(table);
      this.setNewTabIndexAndFocus(newRow, target);
    } else if (tagName === 'TD') {
      // Cell is focused
      const target = keyBoardEvent.target as HTMLTableCellElement;
      const row = target.parentElement as HTMLTableRowElement;

      if (keyBoardEvent.ctrlKey) {
        const table = row.parentElement as HTMLTableElement;
        const newRow = home ? table.rows[0] : this.getLastVisibleRow(table);
        const newCell = newRow.cells[target.cellIndex];
        this.setNewTabIndexAndFocus(newRow, row, false);
        this.setNewTabIndexAndFocus(newCell, target);
      } else {
        const newCell = home ? row.cells[0] : row.cells[row.cells.length - 1];
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
    return newRow?.classList.contains('tce-hidden') ? this.findNextVisibleRow(newRow, direction) : newRow;
  }

  private getLastVisibleRow(table: HTMLTableElement): HTMLTableRowElement {
    const rows = Array.from(table.rows);
    const lastVisibleRow = rows.reverse().find(row => !row.classList.contains('tce-hidden'));
    return lastVisibleRow as HTMLTableRowElement;
  }

  private setNewTabIndexAndFocus(newElement: HTMLElement, oldElement: HTMLElement, setFocus = true): void {
    oldElement.tabIndex = -1;
    newElement.tabIndex = 0;
    if (setFocus) {
      newElement.focus();
    }
  }

  public getTableData(carbonEstimation?: CarbonEstimation): TableItem[] {
    return !carbonEstimation ? placeholderTableData : (
        [
          this.getParentTableItem(
            EmissionsLabels.Upstream,
            carbonEstimation.upstreamEmissions,
            EmissionsColours.Upstream,
            1,
            4
          ),
          ...this.getEmissionsBreakdown(
            carbonEstimation.upstreamEmissions,
            EmissionsLabels.Upstream,
            EmissionsColours.Upstream,
            EmissionsColours.UpstreamLight
          ),
          this.getParentTableItem(
            EmissionsLabels.Direct,
            carbonEstimation.directEmissions,
            EmissionsColours.Direct,
            2,
            4
          ),
          ...this.getEmissionsBreakdown(
            carbonEstimation.directEmissions,
            EmissionsLabels.Direct,
            EmissionsColours.Direct,
            EmissionsColours.OperationLight
          ),
          this.getParentTableItem(
            EmissionsLabels.Indirect,
            carbonEstimation.indirectEmissions,
            EmissionsColours.Indirect,
            3,
            4
          ),
          ...this.getEmissionsBreakdown(
            carbonEstimation.indirectEmissions,
            EmissionsLabels.Indirect,
            EmissionsColours.Indirect,
            EmissionsColours.OperationLight
          ),
          this.getParentTableItem(
            EmissionsLabels.Downstream,
            carbonEstimation.downstreamEmissions,
            EmissionsColours.Downstream,
            4,
            4
          ),
          ...this.getEmissionsBreakdown(
            carbonEstimation.downstreamEmissions,
            EmissionsLabels.Downstream,
            EmissionsColours.Downstream,
            EmissionsColours.DownstreamLight
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
        .map(([key, value], index, array) =>
          this.getChildTableItem(
            key,
            value,
            parent,
            { background: backgroundColour, svg: svgColour },
            display,
            index + 1,
            array.length
          )
        )
    );
  }

  private getParentTableItem(
    label: string,
    value: NumberObject,
    colour: string,
    positionInSet: number,
    setSize: number,
    expanded: boolean = true
  ): TableItem {
    return {
      category: label,
      emissions: this.carbonEstimationUtilService.getOverallPercentageLabel(value),
      colour: { background: colour },
      display: true,
      expanded,
      positionInSet,
      setSize,
      level: 1,
    };
  }

  private getChildTableItem(
    key: string,
    value: number,
    parent: string,
    colour: ItemColour,
    display: boolean,
    positionInSet: number,
    setSize: number
  ): TableItem {
    const { label, svg } = this.carbonEstimationUtilService.getLabelAndSvg(key, parent);
    return {
      category: label,
      emissions: this.carbonEstimationUtilService.getPercentageLabel(value),
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
