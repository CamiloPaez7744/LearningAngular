import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

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
    region:   ['', [Validators.required]],
    country:  ['', [Validators.required]],
    border:   ['', [Validators.required]]
  });
}
