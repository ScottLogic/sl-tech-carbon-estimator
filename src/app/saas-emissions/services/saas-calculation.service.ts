import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SaasUsage, SaasEmissionsData, SaasCalculationResult } from '../models/saas-emissions.interface';
import { SAAS_PROVIDERS } from '../constants/saas-providers.constants';
import { EMISSION_CONVERSION } from '../constants/saas-emissions.constants';

@Injectable({
  providedIn: 'root'
})
export class SaasCalculationService {
  private saasEmissionsSubject = new BehaviorSubject<SaasEmissionsData>({
    providers: [],
    totalMonthlyEmissions: 0,
    totalAnnualEmissions: 0
  });

  public saasEmissions$ = this.saasEmissionsSubject.asObservable();

  calculateProviderEmissions(providerId: string, userCount: number): SaasCalculationResult {
    const provider = SAAS_PROVIDERS.find(p => p.id === providerId);
    
    if (!provider || userCount <= 0) {
      return {
        monthlyEmissions: 0,
        annualEmissions: 0,
        methodology: 'No calculation performed',
        assumptions: []
      };
    }

    const monthlyEmissions = provider.emissionFactorPerUserPerMonth * userCount;
    const annualEmissions = monthlyEmissions * EMISSION_CONVERSION.MONTHS_PER_YEAR;

    return {
      monthlyEmissions,
      annualEmissions,
      methodology: `${monthlyEmissions.toFixed(2)}g CO2e = ${provider.emissionFactorPerUserPerMonth}g per user × ${userCount} users`,
      assumptions: this.getProviderAssumptions(providerId)
    };
  }

  updateSaasUsage(usage: SaasUsage[]): void {
    const updatedUsage = usage.map(u => {
      if (u.isUsed && u.userCount > 0) {
        const calculation = this.calculateProviderEmissions(u.providerId, u.userCount);
        return {
          ...u,
          monthlyEmissions: calculation.monthlyEmissions,
          annualEmissions: calculation.annualEmissions
        };
      }
      return {
        ...u,
        monthlyEmissions: 0,
        annualEmissions: 0
      };
    });

    const totalMonthlyEmissions = updatedUsage.reduce((sum, u) => sum + (u.monthlyEmissions || 0), 0);
    const totalAnnualEmissions = updatedUsage.reduce((sum, u) => sum + (u.annualEmissions || 0), 0);

    this.saasEmissionsSubject.next({
      providers: updatedUsage,
      totalMonthlyEmissions,
      totalAnnualEmissions
    });
  }

  getTotalEmissionsInKg(): number {
    const current = this.saasEmissionsSubject.value;
    return current.totalAnnualEmissions * EMISSION_CONVERSION.GRAMS_TO_KG;
  }

  getTotalEmissionsInTonnes(): number {
    const current = this.saasEmissionsSubject.value;
    return current.totalAnnualEmissions * EMISSION_CONVERSION.GRAMS_TO_TONNES;
  }

  private getProviderAssumptions(providerId: string): string[] {
    // This could be extended to return provider-specific assumptions
    return [
      'Emissions calculated based on average monthly usage patterns',
      'Includes all standard features and applications within the subscription',
      'Based on real organizational usage data where available'
    ];
  }

  resetCalculations(): void {
    this.saasEmissionsSubject.next({
      providers: [],
      totalMonthlyEmissions: 0,
      totalAnnualEmissions: 0
    });
  }
}