import { Injectable } from '@angular/core';
import { Microsoft365 } from '../components/microsoft365-form/microsoft365.constants';
import { KgCo2e } from '../../../types/units';

@Injectable({
  providedIn: 'root',
})
export class Microsoft365Service {
  private EMISSIONS_PER_USER_PER_YEAR: KgCo2e = 1.935;

  calculateEmissions(form: Microsoft365): KgCo2e {
    return form.useMicrosoft365 ? this.calcuateUserEmissions(form.organisationUserCount) : 0;
  }

  private calcuateUserEmissions(userCount: number): KgCo2e {
    return userCount * this.EMISSIONS_PER_USER_PER_YEAR;
  }
}
