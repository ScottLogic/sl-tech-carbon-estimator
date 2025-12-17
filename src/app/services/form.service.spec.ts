import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { FormService } from './form.service';
import { SaasFormService } from '../features/saas/services/saas-form.service';
import { defaultValues } from '../carbon-estimator-form/carbon-estimator-form.constants';
import { EstimatorValues } from '../types/carbon-estimator';

describe('FormService', () => {
  let service: FormService;
  const formBuilder = new FormBuilder();

  let alternateValues: EstimatorValues;

  let mockSaasFormService: Partial<SaasFormService>;

  beforeEach(() => {
    mockSaasFormService = {
      form: formBuilder.nonNullable.group({
        microsoft365: formBuilder.nonNullable.group({
          useMicrosoft365: defaultValues.saas.microsoft365.useMicrosoft365,
          organisationUserCount: defaultValues.saas.microsoft365.organisationUserCount,
        }),
      }),
    };

    TestBed.configureTestingModule({
      providers: [FormBuilder, { provide: SaasFormService, useValue: mockSaasFormService }],
    });

    service = TestBed.inject(FormService);

    alternateValues = {
      upstream: {
        headCount: 10,
        desktopPercentage: 70,
        employeeLocation: 'GBR',
      },
      onPremise: {
        estimateServerCount: true,
        serverLocation: 'ASIA',
        numberOfServers: 321,
      },
      cloud: {
        noCloudServices: false,
        cloudLocation: 'OCEANIA',
        cloudPercentage: 12,
        monthlyCloudBill: { min: 10, max: 432 },
      },
      downstream: {
        noDownstream: true,
        customerLocation: 'EUROPE',
        monthlyActiveUsers: 1002,
        mobilePercentage: 99,
        purposeOfSite: 'information',
      },
      saas: {
        microsoft365: {
          useMicrosoft365: true,
          organisationUserCount: 500,
        },
      },
    };
  });

  it('should initialise a form with expected controls', () => {
    const controls = service.estimatorForm.controls;
    expect(controls.upstream).toBeTruthy();
    expect(controls.onPremise).toBeTruthy();
    expect(controls.cloud).toBeTruthy();
    expect(controls.downstream).toBeTruthy();
    expect(controls.saas).toBeTruthy();
  });

  it('should initialise the form with default values', () => {
    expect(service.estimatorForm.getRawValue()).toEqual(defaultValues);
  });

  it('load() should set the form value', () => {
    expect(service.estimatorForm.getRawValue()).toEqual(defaultValues);
    service.load(alternateValues);
    expect(service.estimatorForm.getRawValue()).toEqual(alternateValues);
  });

  it('reset() should restore initial values', () => {
    service.load(alternateValues);
    expect(service.estimatorForm.getRawValue()).toEqual(alternateValues);
    service.reset();
    expect(service.estimatorForm.getRawValue()).toEqual(defaultValues);
  });
});
