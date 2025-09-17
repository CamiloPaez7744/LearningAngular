import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearchCapital(capital: string) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.isError.set(null);
    this.countries.set([]);
    this.countryService.searchByCapital(capital).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        if (countries.length === 0) {
          this.isError.set(`No countries found with capital "${capital}"`);
          return;
        }
        this.countries.set(countries);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.isError.set(error.message ?? 'An error occurred while searching for countries');
        console.error({ error });
      }
    });
  }
}
