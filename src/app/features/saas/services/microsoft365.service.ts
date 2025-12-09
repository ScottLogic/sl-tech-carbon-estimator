import { Injectable } from '@angular/core';
import { Microsoft365 } from '../components/microsoft365-form.component.html/microsoft365.constants';

@Injectable({
  providedIn: 'root',
})
export class Microsoft365Service {
  private EMISSIONS_PER_USER = 0.1451746121;

  calculateEmissions(form: Microsoft365): number {
    return form.useMicrosoft365 ? this.calcuateUserEmissions(form.organisationUserCount) : 0;
  }

  private calcuateUserEmissions(userCount: number): number {
    return userCount * this.EMISSIONS_PER_USER;
  }
}
