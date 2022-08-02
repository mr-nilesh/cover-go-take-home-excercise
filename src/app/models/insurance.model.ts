import { Country } from "./country.model";

export interface Package {
  name: string;
  key: string;
  pkgRatePercentage: number;
}

export interface InsuraneDetails {
  name: string;
  age: string;
  country: Country;
  package: Package;
  premium: number;
};