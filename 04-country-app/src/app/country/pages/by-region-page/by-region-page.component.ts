import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { Country } from '../../interfaces/country.interface';
import { Region } from '../../interfaces/region.interface';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(param: string): Region {
  param = param.toLowerCase();

  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic'
  };
  return validRegions[param] ?? 'Americas';
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);
  countries = signal<Country[]>([]);
  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  queryParam = this.activatedRouter.snapshot.queryParamMap.get('region') ?? '';
  selectedRegion = linkedSignal<Region>(() => {
    return validateQueryParam(this.queryParam);
  });
  regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];


  regionResource = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if (!params.region) {
        return of([]);
      }
      this.router.navigate(['/country/by-region'], {
        queryParams: { region: params.region },
      });
      return this.countryService.searchByRegion(params.region);
    },
  });
}
