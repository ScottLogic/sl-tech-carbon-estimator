import { SaasProviderDetails } from "../models/saas-emissions.interface";

export interface Microsoft365Usage extends SaasProviderDetails {
  id: 'microsoft365',
  name: 'Microsoft 365',
  description: 'Microsoft 365 Business and Enterprise subscriptions'
}

export interface Microsoft365EmissionData {
  baseEmissionFactor: number; // grams CO2e per user per month
  dataSource: string;
  lastUpdated: Date;
  methodology: string;
  assumptions: string[];
}

export const MICROSOFT_365_EMISSION_DATA: Microsoft365EmissionData = {
  baseEmissionFactor: 145.17, // grams CO2e per user per month (from SL data)
  dataSource: 'SL Internal Microsoft Emission Impact Tool Data (12-month average)',
  lastUpdated: new Date('2025-10-24'),
  methodology: 'Average monthly emissions per user calculated from Microsoft Emission Impact Tool data over 12 months (Sept 2024 - Aug 2025)',
  assumptions: [
    'Based on typical business usage patterns',
    'Includes Exchange Online, SharePoint, Teams, OneDrive, and Office applications',
    'Emissions calculated using Microsoft\'s official methodology',
    'Average of 12 months of real usage data from SL organisation',
    'Does not include device manufacturing or end-of-life emissions'
  ]
};