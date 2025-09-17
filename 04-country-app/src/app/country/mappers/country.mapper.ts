import { Country } from '../interfaces/country.interface';
import { RESTCountry } from '../interfaces/res-countries.interface';

export class CountryMapper {
  static toCountry(country: RESTCountry): Country {
    return {
      cca3: country.cca3,
      flag: country.flags.png,
      flagSvg: country.flags.svg,
      name: country.translations['spa']?.common ?? country.name.common,
      capital: country.capital ? country.capital[0] : 'N/A',
      population: country.population,
    };
  }

  static toCountries(countries: RESTCountry[]): Country[] {
    return countries.map(this.toCountry);
  }

}
