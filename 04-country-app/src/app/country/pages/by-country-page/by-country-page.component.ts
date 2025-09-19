import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { firstValueFrom, of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  country = signal('');

  countryResource = rxResource({
    params: () => ({ country: this.country() }),
    stream: ({ params }) => {
      if (!params.country) {
        return of([]);
      }
      return this.countryService.searchByCountry(params.country);
    },
  });

  // countryResource = resource({
  //   params: () => ({ country: this.country() }),
  //   loader: async({ params }) => {
  //     if (!params.country) return [];
  //     return firstValueFrom(this.countryService.searchByCountry(params.country));
  //   }
  // })
}
