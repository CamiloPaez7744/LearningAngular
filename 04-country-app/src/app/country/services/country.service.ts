import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/res-countries.interface';
import { Country } from '../interfaces/country.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(capital: string): Observable<Country[]> {
    capital = capital.toLowerCase().trim();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${capital}`).pipe(
      map(restCountry => CountryMapper.toCountries(restCountry)),
      catchError((error) => {
        console.error({ error });
        return throwError(() => new Error(`Error fetching countries with capital "${capital}"`));
      })
    );
  }

  searchByCountry(country: string): Observable<Country[]> {
    country = country.toLowerCase().trim();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${country}`).pipe(
      map(restCountry => CountryMapper.toCountries(restCountry)),
      catchError((error) => {
        console.error({ error });
        return throwError(() => new Error(`Error fetching countries with name "${country}"`));
      })
    );
  }
}
