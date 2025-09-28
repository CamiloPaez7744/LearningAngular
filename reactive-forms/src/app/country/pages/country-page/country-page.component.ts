import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

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
    const regionSubscribe = this.onRegionChange();
    onCleanup(() => {
      regionSubscribe.unsubscribe();
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
          console.log({ countries });
          this.countriesByRegion.set(countries);
        }
      );
  }

  // formRegionChanges = this.myForm.get('region')?.valueChanges.subscribe(
  //   console.log()
  // );
}
