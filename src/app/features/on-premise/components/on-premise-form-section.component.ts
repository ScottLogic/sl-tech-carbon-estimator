import { Component, inject, OnInit } from '@angular/core';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import {
  formContext,
  FormContextSection,
} from '../../../components/carbon-estimator-form/carbon-estimator-form.constants';
import { InvalidatedPipe } from '../../../pipes/invalidated.pipe';
import { LocationInputComponent } from '../../../components/location-input/location-input.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnPremiseFormGroup } from '../services/on-premise-form.service';
import { NoteComponent } from '../../../components/note/note.component';
import { EstimatorFormValues, EstimatorValues } from '../../../types/carbon-estimator';
import { CarbonEstimationService } from '../../../services/carbon-estimation.service';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'on-premise-form-section',
  standalone: true,
  templateUrl: './on-premise-form-section.component.html',
  imports: [
    SectionHeaderComponent,
    InvalidatedPipe,
    LocationInputComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NoteComponent,
  ],
})
export class OnPremiseFormSectionComponent implements OnInit {
  private formService = inject(FormService);
  private estimationService = inject(CarbonEstimationService);

  public form!: FormGroup<EstimatorFormValues>;

  get onPremiseForm(): OnPremiseFormGroup {
    return this.form.get('onPremise') as OnPremiseFormGroup;
  }

  previewServerCount = 10;
  estimateServerCount = false;

  ngOnInit(): void {
    this.form = this.formService.estimatorForm;

    const estimateControl = this.form.get('onPremise.estimateServerCount');

    this.estimateServerCount = !!estimateControl?.value;
    this.toggleServerInput(this.estimateServerCount);

    estimateControl?.valueChanges.subscribe(isChecked => {
      this.estimateServerCount = isChecked;
      this.refreshPreviewServerCount();
      this.toggleServerInput(isChecked);
    });

    this.form.get('cloud.cloudPercentage')?.valueChanges.subscribe(() => this.refreshPreviewServerCount());
    this.form.get('cloud.noCloudServices')?.valueChanges.subscribe(() => {
      this.refreshPreviewServerCount();
    });

    this.form.get('upstream.headCount')?.valueChanges.subscribe(() => {
      this.refreshPreviewServerCount();
    });
  }

  formContext: FormContextSection = formContext.onPremise;

  get numberOfServers() {
    return this.form.get('onPremise.numberOfServers');
  }

  errorConfig = {
    numberOfServers: {
      inputId: 'numberOfServers',
      errorMessage: 'The number of servers must be greater than 0',
    },
  };

  private refreshPreviewServerCount() {
    if (this.estimateServerCount) {
      this.previewServerCount = this.estimationService.estimateServerCount(this.form.getRawValue() as EstimatorValues);
    }
  }

  private toggleServerInput(isEstimating: boolean) {
    const noServers = this.form.get('onPremise.numberOfServers');
    if (isEstimating) {
      noServers?.disable();
    } else {
      noServers?.enable();
    }
  }
}
