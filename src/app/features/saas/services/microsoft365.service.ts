import { Injectable } from '@angular/core';
import { Microsoft365 } from '../components/microsoft365-form.component.html/microsoft365.constants';

@Injectable({
  providedIn: 'root',
})
export class Microsoft365Service {
  calculateEmissions(form: Microsoft365): number {
    return form.useMicrosoft365 ? this.calcuateUserEmissions(form.organisationUserCount) : 0;
  }

  private calcuateUserEmissions(userCount: number): number {
    const emissionsPerUserPerYear = 0.164854;

    return userCount * emissionsPerUserPerYear;
  }
}
