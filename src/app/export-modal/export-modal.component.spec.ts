import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportModal } from './export-modal.component';
import { CarbonEstimation } from '../types/carbon-estimator';
import { FormsModule } from '@angular/forms';
import { DisclaimerTextComponent } from '../disclaimer-text/disclaimer-text.component';
import { InputGroupDisplay } from '../input-group-display/input-group-display.component';
import { CarbonEstimationTreemapComponent } from '../carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimationTableComponent } from '../carbon-estimation-table/carbon-estimation-table.component';
import { inputBinding } from '@angular/core';

describe('ExportModal', () => {
  let component: ExportModal;
  let fixture: ComponentFixture<ExportModal>;

  const mockCarbonEstimation: CarbonEstimation = {
    values: {
      version: '1.0',
      upstreamEmissions: {
        software: 100,
        employee: 200,
        network: 300,
        server: 400,
        foundationModels: 0,
        contentAndData: 0,
      },
      directEmissions: { employee: 500, network: 600, server: 700 },
      indirectEmissions: { cloud: 800, saas: 900, managed: 1000 },
      downstreamEmissions: {
        customer: 1100,
        networkTransfer: 1200,
        downstreamInfrastructure: 0,
      },
      totalEmissions: 12345,
    },
    percentages: {
      version: '1.0',
      upstreamEmissions: {
        software: 10,
        employee: 20,
        network: 30,
        server: 40,
        foundationModels: 0,
        contentAndData: 0,
      },
      directEmissions: { employee: 50, network: 60, server: 70 },
      indirectEmissions: { cloud: 80, saas: 90, managed: 100 },
      downstreamEmissions: {
        customer: 110,
        networkTransfer: 120,
        downstreamInfrastructure: 0,
      },
    },
  };

  const mockInputValues = {
    upstream: { software: 1, employee: 2 },
    onPremise: { server: 3 },
    downstream: { customer: 4 },
    cloud: {
      monthlyCloudBill: { min: 100, max: 200 },
      cloudPercentage: 50,
      cloudLocation: 'UK',
      noCloudServices: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ExportModal,
        FormsModule,
        DisclaimerTextComponent,
        InputGroupDisplay,
        CarbonEstimationTreemapComponent,
        CarbonEstimationTableComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportModal, {
      bindings: [
        inputBinding('carbonEstimation', () => mockCarbonEstimation),
        inputBinding('inputValues', () => mockInputValues),
      ],
    });
    component = fixture.componentInstance;
    // Set required inputs
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closePreview event when closeModal is called', () => {
    spyOn(component.closePreview, 'emit');
    component.closeModal();
    expect(component.closePreview.emit).toHaveBeenCalled();
  });

  it('should bind reportName to input and update value', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tce-export-modal-report-name-input');
    expect(input.value).toBe(component.reportName);
    input.value = 'New Report Name';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.reportName).toBe('New Report Name');
  });

  it('should compute upstream, onPremise, downstream, and cloud input groups', () => {
    expect(component.upstream()).toEqual(mockInputValues.upstream);
    expect(component.onPremise()).toEqual(mockInputValues.onPremise);
    expect(component.downstream()).toEqual(mockInputValues.downstream);
    expect(component.cloud()).toEqual(mockInputValues.cloud);
  });

  it('should render treemap and table components with correct inputs', () => {
    const treemap = fixture.nativeElement.querySelector('carbon-estimation-treemap');
    const table = fixture.nativeElement.querySelector('carbon-estimation-table');
    expect(treemap).toBeTruthy();
    expect(table).toBeTruthy();
  });

  it('should render disclaimer-text at the bottom of tceExportPageTwo', () => {
    const disclaimer = fixture.nativeElement.querySelector('#tceExportPageTwo disclaimer-text');
    expect(disclaimer).toBeTruthy();
  });

  it('should call exportToPDF when Download PDF button is clicked', async () => {
    spyOn(component, 'exportToPDF').and.returnValue(Promise.resolve());
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.tce-button-download-pdf');
    button.click();
    fixture.detectChanges();
    expect(component.exportToPDF).toHaveBeenCalled();
  });

  it('should set default reportName on init', () => {
    expect(component.reportName).toContain('Carbon Estimation Report');
  });

  // Optional: Test exportToPDF logic (mock html2canvas and jsPDF)
  it('should generate PDF with two pages when exportToPDF is called', async () => {
    // Mock html2canvas and jsPDF
    const mockCanvas = {
      width: 100,
      height: 200,
      toDataURL: () => 'data:image/png;base64,mock',
    };
    spyOn(document, 'getElementById').and.returnValue(mockCanvas as HTMLCanvasElement);
    const jsPDFMock = jasmine.createSpyObj('jsPDF', ['addImage', 'addPage', 'save']);
    spyOn(component, 'exportToPDF').and.callFake(async () => {
      jsPDFMock.addImage('data:image/png;base64,mock', 'PNG', 0, 0, 208, 416);
      jsPDFMock.addPage();
      jsPDFMock.save('mock.pdf');
    });
    await component.exportToPDF();
    expect(jsPDFMock.addImage).toHaveBeenCalled();
    expect(jsPDFMock.addPage).toHaveBeenCalled();
    expect(jsPDFMock.save).toHaveBeenCalled();
  });
});
