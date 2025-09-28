import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder);
  private countryService = inject(CountryService);

  regions = signal<string[]>(this.countryService.regions);
  countriesByRegion = signal<Country[]>([]);
  bordersByCountry = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]]
  });

  onFormChanges = effect((onCleanup) => {
    const regionSubscription = this.onRegionChange();
    const countrySubscription = this.onCountryChange();

    onCleanup(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });

  onRegionChange() {
    return this.myForm.get('region')!?.valueChanges
      .pipe(
        tap(() => { this.myForm.get('country')!?.reset(''); }),
        tap(() => { this.myForm.get('border')!?.reset(''); }),
        tap(() => {
          this.countriesByRegion.set([]);
          this.bordersByCountry.set([]);
        }),
        switchMap((region) => this.countryService.getCountriesByRegion(region!)),
      )
      .subscribe(
        (countries) => {
          this.countriesByRegion.set(countries);
        }
      );
  }

  onCountryChange() {
    return this.myForm.get('country')!?.valueChanges
      .pipe(
        tap(() => { this.myForm.get('border')!?.reset(''); }),
        tap(() => { this.bordersByCountry.set([]); }),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) => this.countryService.getCountryByAlphaCode(alphaCode!)),
        switchMap((country) => {
          if (!country) return [];
          return this.countryService.getCountryNamesByCodes(country.borders);
        }),
      )
      .subscribe(
        (borders) => {
          this.bordersByCountry.set(borders);
        }
      );
  }
}
