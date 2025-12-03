import { Component, computed, input } from '@angular/core';
import {
  formContext,
  FormContextKey,
  locationDescriptions,
  questionPanelConfig,
} from '../../carbon-estimator-form/carbon-estimator-form.constants';
import { ExpansionPanelComponent } from '../../expansion-panel/expansion-panel.component';
import { locationArray } from '../../types/carbon-estimator';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from '../../note/note.component';

@Component({
  selector: 'location-input',
  templateUrl: './location-input.component.html',
  standalone: true,
  imports: [ExpansionPanelComponent, ReactiveFormsModule, NoteComponent, CommonModule],
})
export class LocationInputComponent {
  locationForm = input.required<FormGroup>();
  formContextKey = input.required<FormContextKey>();

  public questionPanelConfig = questionPanelConfig;
  public formContext = formContext;

  public formControlName = computed(() => {
    return this.formContext[this.formContextKey()].location.formControlName;
  });

  public label = computed(() => {
    return this.formContext[this.formContextKey()].location.label;
  });

  public helperText = computed(() => {
    return this.formContext[this.formContextKey()].location.helperText;
  });

  public hasUnknown = computed(() => {
    return this.formContext[this.formContextKey()].location.hasUnknown;
  });

  public locationDescriptions = locationArray.map(location => ({
    value: location,
    description: locationDescriptions[location],
  }));
}
