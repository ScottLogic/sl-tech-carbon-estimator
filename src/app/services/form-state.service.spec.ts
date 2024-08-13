import { TestBed } from '@angular/core/testing';

import { FormStateService } from './form-state.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EstimatorFormValues, EstimatorValues, WorldLocation } from '../types/carbon-estimator';
import { costRanges } from '../carbon-estimator-form/carbon-estimator-form.constants';

const formValues: EstimatorValues = {
  upstream: {
    headCount: 100,
    desktopPercentage: 50,
    employeeLocation: 'WORLD',
  },
  onPremise: {
    estimateServerCount: false,
    serverLocation: 'WORLD',
    numberOfServers: 10,
  },
  cloud: {
    noCloudServices: false,
    cloudLocation: 'WORLD',
    cloudPercentage: 50,
    monthlyCloudBill: costRanges[0],
  },
  downstream: {
    noDownstream: false,
    customerLocation: 'WORLD',
    monthlyActiveUsers: 100,
    mobilePercentage: 50,
    purposeOfSite: 'average',
  },
};

const formBuilder = new FormBuilder();

describe('FormStateService', () => {
  let service: FormStateService;
  let estimatorForm: FormGroup<EstimatorFormValues>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStateService);
    estimatorForm = formBuilder.nonNullable.group({
      upstream: formBuilder.nonNullable.group({
        headCount: [formValues.upstream.headCount],
        desktopPercentage: [formValues.upstream.desktopPercentage],
        employeeLocation: [formValues.upstream.employeeLocation],
      }),
      onPremise: formBuilder.nonNullable.group({
        estimateServerCount: [formValues.onPremise.estimateServerCount],
        serverLocation: [formValues.onPremise.serverLocation as WorldLocation | 'unknown'],
        numberOfServers: [formValues.onPremise.numberOfServers],
      }),
      cloud: formBuilder.nonNullable.group({
        noCloudServices: [false],
        cloudLocation: [formValues.cloud.cloudLocation as WorldLocation | 'unknown'],
        cloudPercentage: [formValues.cloud.cloudPercentage],
        monthlyCloudBill: [formValues.cloud.monthlyCloudBill],
      }),
      downstream: formBuilder.nonNullable.group({
        noDownstream: [false],
        customerLocation: [formValues.downstream.customerLocation],
        monthlyActiveUsers: [formValues.downstream.monthlyActiveUsers],
        mobilePercentage: [formValues.downstream.mobilePercentage],
        purposeOfSite: [formValues.downstream.purposeOfSite],
      }),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getControlStates()', () => {
    it('should return the states of controls that are marked as dirty or touched', () => {
      estimatorForm.get('upstream.headCount')?.markAsDirty();
      estimatorForm.get('upstream.headCount')?.markAsTouched();
      estimatorForm.get('onPremise.serverLocation')?.markAsDirty();
      estimatorForm.get('cloud.cloudLocation')?.markAsTouched();

      const controlStates = service.getControlStates(estimatorForm);
      const expectedControlStates = {
        'upstream.headCount': {
          dirty: true,
          touched: true,
        },
        'onPremise.serverLocation': {
          dirty: true,
          touched: false,
        },
        'cloud.cloudLocation': {
          dirty: false,
          touched: true,
        },
      };

      expect(controlStates).toEqual(expectedControlStates);
    });
  });

  describe('setControlStates()', () => {
    const singleControlTestCases = [
      {
        controlName: 'upstream.headCount',
        dirty: true,
        touched: true,
      },
      {
        controlName: 'upstream.headCount',
        dirty: true,
        touched: false,
      },
      {
        controlName: 'upstream.headCount',
        dirty: false,
        touched: true,
      },
    ];

    singleControlTestCases.forEach(testCase => {
      it(`should set the control state on the form when dirty = ${testCase.dirty} and touched = ${testCase.touched}`, () => {
        const controlStates = {
          [testCase.controlName]: {
            dirty: testCase.dirty,
            touched: testCase.touched,
          },
        };

        service.setControlStates(estimatorForm, controlStates);
        const control = estimatorForm.get(testCase.controlName);
        const controlState = {
          dirty: control?.dirty,
          touched: control?.touched,
        };
        const expectedControlState = {
          dirty: testCase.dirty,
          touched: testCase.touched,
        };

        expect(controlState).toEqual(expectedControlState);
      });
    });

    it('should set all the control states when passed multiple control states', () => {
      const controlStatesArg = {
        'upstream.headCount': {
          dirty: true,
          touched: true,
        },
        'onPremise.serverLocation': {
          dirty: true,
          touched: false,
        },
        'cloud.cloudLocation': {
          dirty: false,
          touched: true,
        },
      };

      service.setControlStates(estimatorForm, controlStatesArg);

      const controlStates = {
        'upstream.headCount': {
          dirty: estimatorForm.get('upstream.headCount')?.dirty,
          touched: estimatorForm.get('upstream.headCount')?.touched,
        },
        'onPremise.serverLocation': {
          dirty: estimatorForm.get('onPremise.serverLocation')?.dirty,
          touched: estimatorForm.get('onPremise.serverLocation')?.touched,
        },
        'cloud.cloudLocation': {
          dirty: estimatorForm.get('cloud.cloudLocation')?.dirty,
          touched: estimatorForm.get('cloud.cloudLocation')?.touched,
        },
      };

      const expectedControlStates = controlStatesArg;

      expect(controlStates).toEqual(expectedControlStates);
    });
  });
});
