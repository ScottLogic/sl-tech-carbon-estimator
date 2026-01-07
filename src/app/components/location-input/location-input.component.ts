import { Component, computed, forwardRef, input } from '@angular/core';
import {
  formContext,
  Location,
  locationDescriptions,
  questionPanelConfig,
} from '../../carbon-estimator-form/carbon-estimator-form.constants';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { locationArray, WorldLocation } from '../../types/carbon-estimator';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from '../note/note.component';

@Component({
  selector: 'location-input',
  templateUrl: './location-input.component.html',
  standalone: true,
  imports: [ExpansionPanelComponent, ReactiveFormsModule, NoteComponent, CommonModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LocationInputComponent), multi: true }],
})
export class LocationInputComponent implements ControlValueAccessor {
  locationContext = input.required<Location>();

  public location = new FormControl<WorldLocation | 'unknown'>('unknown');

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.location.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  public questionPanelConfig = questionPanelConfig;
  public formContext = formContext;

  public formControlName = computed(() => {
    return this.locationContext().formControlName;
  });

  public label = computed(() => {
    return this.locationContext().label;
  });

  public helperText = computed(() => {
    return this.locationContext().helperText;
  });

  public hasUnknown = computed(() => {
    return this.locationContext().hasUnknown;
  });

  public locationDescriptions = locationArray.map(location => ({
    value: location,
    description: locationDescriptions[location],
  }));

  writeValue(value: WorldLocation | null): void {
    this.location.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.location.disable();
    } else {
      this.location.enable();
    }
  }
}
