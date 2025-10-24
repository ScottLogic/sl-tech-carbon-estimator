// General SaaS provider details
export interface SaasProviderDetails {
  id: string;
  name: string;
  description?: string;
}

//List of SaaS providers by their unique IDs
export interface SaasProvidersDictionary { 
  [providerId: string]: SaasProviderDetails;
}

// Emissions summary for a single provider
export interface SaasUsage {
  providerId: string;
  isUsed: boolean;
  userCount: number;
  monthlyEmissions?: number; // calculated grams CO2e
  annualEmissions?: number; // calculated grams CO2e
  methodology?: string;
  assumptions?: string[];
}

// Overall SaaS emissions summary
export interface SaasEmissionsSummary {
  providers: SaasUsage[];
  totalMonthlyEmissions: number;
  totalAnnualEmissions: number;
}