import { ChangeDetectionStrategy, Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('capital') ?? '';
  capital = linkedSignal<string>(() => this.queryParam);

  countryResource = rxResource({
    params: () => ({ capital: this.capital() }),
    stream: ({ params }) => {
      if (!params.capital) {
        return of([]);
      }
      this.router.navigate(['/country/by-capital'], {
        queryParams: { capital: params.capital },
      });
      return this.countryService.searchByCapital(params.capital);
    },
  });

  // countryResource = resource({
  //   params: () => ({ capital: this.capital() }),
  //   loader: async({ params }) => {
  //     if (!params.capital) return [];
  //     return firstValueFrom(this.countryService.searchByCapital(params.capital));
  //   }
  // })

  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearchCapital(capital: string) {
  //   if (this.isLoading()) return;
  //   this.isLoading.set(true);
  //   this.isError.set(null);
  //   this.countries.set([]);
  //   this.countryService.searchByCapital(capital).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       if (countries.length === 0) {
  //         this.isError.set(`No countries found with capital "${capital}"`);
  //         return;
  //       }
  //       this.countries.set(countries);
  //     },
  //     error: (error) => {
  //       this.isLoading.set(false);
  //       this.isError.set(error.message ?? 'An error occurred while searching for countries');
  //       console.error({ error });
  //     }
  //   });
  // }
}
