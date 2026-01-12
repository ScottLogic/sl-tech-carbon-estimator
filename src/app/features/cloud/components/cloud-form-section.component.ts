import { Component, computed, input, Signal, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { costRanges, formContext } from '../../../components/carbon-estimator-form/carbon-estimator-form.constants';
import { FormatCostRangePipe } from '../../../pipes/format-cost-range.pipe';
import { compareCostRanges } from '../../../utils/cost-range';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { LocationInputComponent } from '../../../components/location-input/location-input.component';
import { defaultValues } from '../../../services/form.service';

@Component({
  selector: 'app-cloud-form-section',
  templateUrl: './cloud-form-section.component.html',
  standalone: true,
  imports: [
    FormatCostRangePipe,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SectionHeaderComponent,
    LocationInputComponent,
  ],
})
export class CloudFormSectionComponent implements OnInit {
  estimatorForm = input.required<FormGroup>();

  public noCloudServices = signal(defaultValues.cloud.noCloudServices);
  public cloudPercentage = signal(defaultValues.cloud.cloudPercentage);
  public isEstimatingServers = signal(defaultValues.onPremise.estimateServerCount);
  public onPremisePercentage: Signal<number> = computed(() => 100 - this.cloudPercentage());

  public compareCostRanges = compareCostRanges;

  public costRanges = costRanges;
  public formContext = formContext;

  public ngOnInit() {
    this.estimatorForm()
      .get('cloud.cloudPercentage')
      ?.valueChanges.subscribe(cloudPercentage => {
        this.cloudPercentage.set(cloudPercentage);
      });

    const cloudPercentageInitial = this.estimatorForm().get('cloud.cloudPercentage')?.value;
    this.cloudPercentage.set(cloudPercentageInitial ?? defaultValues.cloud.cloudPercentage);

    this.estimatorForm()
      .get('cloud.noCloudServices')
      ?.valueChanges.subscribe(noCloudServices => {
        this.noCloudServices.set(noCloudServices);
      });

    const noCloudServicesInitial = this.estimatorForm().get('cloud.noCloudServices')?.value;
    this.noCloudServices.set(!!noCloudServicesInitial);

    this.estimatorForm()
      .get('onPremise.estimateServerCount')
      ?.valueChanges.subscribe(val => {
        this.isEstimatingServers.set(val);
      });

    const isEstimatingServersInitial = this.estimatorForm().get('onPremise.estimateServerCount')?.value;
    this.isEstimatingServers.set(!!isEstimatingServersInitial);
  }
}
