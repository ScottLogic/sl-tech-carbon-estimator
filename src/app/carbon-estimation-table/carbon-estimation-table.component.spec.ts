import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationTableComponent, TableItem } from './carbon-estimation-table.component';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';
import { CarbonEstimation } from '../types/carbon-estimator';
import { EmissionsLabels } from '../carbon-estimation/carbon-estimation.constants';

describe('CarbonEstimationTableComponent', () => {
  let component: CarbonEstimationTableComponent;
  let fixture: ComponentFixture<CarbonEstimationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationTableComponent],
      providers: [CarbonEstimationUtilService],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimationTableComponent);
    component = fixture.componentInstance;
    const carbonEstimation: CarbonEstimation = {
      percentages: {
        version: '1.0',
        upstreamEmissions: {
          software: 7,
          employee: 6,
          network: 6,
          server: 6,
          foundationModels: 0,
          contentAndData: 0
        },
        directEmissions: {
          employee: 9,
          network: 8,
          server: 8,
        },
        indirectEmissions: {
          cloud: 9,
          saas: 8,
          managed: 8,
        },
        downstreamEmissions: {
          customer: 13,
          networkTransfer: 12,
          downstreamInfrastructure: 0
        },
      },
      values: {
        version: '1.0',
        upstreamEmissions: {
          software: 700,
          employee: 600,
          network: 600,
          server: 600,
          foundationModels: 0,
          contentAndData: 0
        },
        directEmissions: {
          employee: 900,
          network: 800,
          server: 800,
        },
        indirectEmissions: {
          cloud: 900,
          saas: 800,
          managed: 800,
        },
        downstreamEmissions: {
          customer: 1300,
          networkTransfer: 1200,
          downstreamInfrastructure: 0
        },
        totalEmissions: 7000,
      },
    };

    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);
    fixture.componentRef.setInput('shouldShowSvgs', true); // or false, as needed
    fixture.detectChanges();
  });

  it('should toggle display value of child emissions when toggle called', () => {
    component.toggle(EmissionsLabels.Upstream);
    fixture.detectChanges();
    component.tableData().forEach(emission => {
      if (emission.level === 1 && emission.category === EmissionsLabels.Upstream) {
        expect(emission.expanded).toBeFalse();
      }
      if (emission.level === 2 && emission.parent === EmissionsLabels.Upstream) {
        expect(emission.display).toBeFalse();
      }
    });
  });

  it('should set child emissions to display by default', () => {
    component.tableData().forEach(emission => {
      if (emission.level === 2 && emission.parent) {
        expect(emission.display).toBeTrue();
      }
    });
  });

  it('should get emissions when getEmissions called', () => {
    const tableData = component.tableData();
    expect(tableData.length).toBe(17);
  });

  it('should call toggle when left arrow clicked on expanded parent row', () => {
    const toggleSpy = spyOn(component, 'toggle');
    const parentRow = fixture.debugElement.nativeElement.querySelector('tbody tr');

    parentRow.focus();
    fixture.detectChanges();

    component.parentRowArrowKeyBoardEvent(
      { target: parentRow, currentTarget: parentRow, preventDefault: () => {} } as unknown as Event,
      'left',
      EmissionsLabels.Upstream,
      true
    );

    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should call toggle when right arrow clicked on none expanded parent row', () => {
    const toggleSpy = spyOn(component, 'toggle');
    const parentRow = fixture.debugElement.nativeElement.querySelector('tbody tr');

    parentRow.focus();
    fixture.detectChanges();
    component.parentRowArrowKeyBoardEvent(
      { target: parentRow, currentTarget: parentRow, preventDefault: () => {} } as unknown as Event,
      'right',
      EmissionsLabels.Upstream,
      false
    );

    fixture.detectChanges();
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should move focus to down row when down arrow clicked on row', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.querySelector('tr');
    row.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: row, preventDefault: () => {} } as unknown as Event, 'down');
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[1]);
  });

  it('should move focus to up row when up arrow clicked on row', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[2];
    row.tabIndex = 0;
    fixture.detectChanges();
    row.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: row, preventDefault: () => {} } as unknown as Event, 'up');
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[1]);
  });

  it('should move focus to last row when end clicked on row', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    row.focus();
    fixture.detectChanges();

    component.homeEndKeyBoardEvent({ target: row, preventDefault: () => {}, key: 'End' } as unknown as Event);
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[table.rows.length - 1]);
  });

  it('should move focus to first row when home clicked on row', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[2];
    row.tabIndex = 0;
    fixture.detectChanges();
    row.focus();
    fixture.detectChanges();

    component.homeEndKeyBoardEvent({ target: row, preventDefault: () => {}, key: 'Home' } as unknown as Event);
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[0]);
  });

  it('should move focus to cell when right arrow clicked on row', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.querySelector('tr');
    row.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: row, preventDefault: () => {} } as unknown as Event, 'right');
    fixture.detectChanges();
    expect(document.activeElement).toBe(row.cells[0]);
  });

  it('should move focus to row when left arrow clicked on left hand cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[0];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'left');
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[0]);
  });

  it('should move focus to left cell when left arrow clicked on right hand cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'left');
    fixture.detectChanges();
    expect(document.activeElement).toBe(row.cells[0]);
  });

  it('should move focus to right cell when right arrow clicked on left hand cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[0];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'right');
    fixture.detectChanges();
    expect(document.activeElement).toBe(row.cells[1]);
  });

  it('should move focus to down a cell when down arrow clicked on cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[0];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'down');
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[row.sectionRowIndex + 1].cells[cell.cellIndex]);
  });

  it('should move focus to up a cell when up arrow clicked on cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[2];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    row.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'up');
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[row.sectionRowIndex - 1].cells[1]);
  });

  it('should move focus to last cell when end clicked on cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[0];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.homeEndKeyBoardEvent({ target: cell, preventDefault: () => {}, key: 'End' } as unknown as Event);
    fixture.detectChanges();
    expect(document.activeElement).toBe(row.cells[row.cells.length - 1]);
  });

  it('should move focus to first cell when home clicked on cell', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.homeEndKeyBoardEvent({ target: cell, preventDefault: () => {}, key: 'Home' } as unknown as Event);
    fixture.detectChanges();
    expect(document.activeElement).toBe(row.cells[0]);
  });

  it('should move focus to corresponding cell in first row when control and home are clicked', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[4];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.homeEndKeyBoardEvent({
      target: cell,
      preventDefault: () => {},
      ctrlKey: true,
      key: 'Home',
    } as unknown as Event);
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[0].cells[cell.cellIndex]);
  });

  it('should move focus to corresponding cell in last row when control and end are clicked', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[2];
    const cell = row.cells[0];
    cell.tabIndex = 0;
    fixture.detectChanges();
    cell.focus();
    fixture.detectChanges();

    component.homeEndKeyBoardEvent({
      target: cell,
      preventDefault: () => {},
      ctrlKey: true,
      key: 'End',
    } as unknown as Event);
    fixture.detectChanges();
    expect(document.activeElement).toBe(table.rows[table.rows.length - 1].cells[cell.cellIndex]);
  });

  it('should move row to next visible row when up/down arrow clicked', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    component.toggle(EmissionsLabels.Upstream);
    fixture.detectChanges();
    row.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: row, preventDefault: () => {} } as unknown as Event, 'down');
    fixture.detectChanges();
    expect(document.activeElement).not.toBe(table.rows[1]);
    expect(document.activeElement).toBe(
      table.rows[component.tableData().findIndex((emission: TableItem) => emission.category === EmissionsLabels.Direct)]
    );
  });

  it('should not move focus when focus is on right edge and press right arrow', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[1];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    row.tabIndex = 0;
    fixture.detectChanges();

    const focusSpy = spyOn(cell, 'focus').and.callThrough();

    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'right');
    fixture.detectChanges();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('should not move focus when focus is on top edge and press up arrow', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[0];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    row.tabIndex = 0;
    fixture.detectChanges();

    const focusSpy = spyOn(cell, 'focus').and.callThrough();

    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'up');
    fixture.detectChanges();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('should not move focus when focus is on bottom edge and press down arrow', () => {
    const table = fixture.debugElement.nativeElement.querySelector('tbody');
    const row = table.rows[table.rows.length - 1];
    const cell = row.cells[1];
    cell.tabIndex = 0;
    row.tabIndex = 0;
    fixture.detectChanges();

    const focusSpy = spyOn(cell, 'focus').and.callThrough();

    cell.focus();
    fixture.detectChanges();

    component.arrowKeyBoardEvent({ target: cell, preventDefault: () => {} } as unknown as Event, 'down');
    fixture.detectChanges();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('should not render SVGs when shouldShowSvgs is false', () => {
    // Set shouldShowSvgs to false
    fixture.componentRef.setInput('shouldShowSvgs', false);
    fixture.detectChanges();

    // Query for SVG elements in the table
    const svgElements = fixture.debugElement.nativeElement.querySelectorAll('svg');
    expect(svgElements.length).toBe(0);
  });
});
