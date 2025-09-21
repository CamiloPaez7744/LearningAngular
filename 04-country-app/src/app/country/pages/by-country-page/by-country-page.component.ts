import { ChangeDetectionStrategy, Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { firstValueFrom, of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('country') ?? '';
  country = linkedSignal<string>(() => this.queryParam);

  countryResource = rxResource({
    params: () => ({ country: this.country() }),
    stream: ({ params }) => {
      if (!params.country) {
        return of([]);
      }
      this.router.navigate(['/country/by-country'], {
        queryParams: { country: params.country },
      });
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
