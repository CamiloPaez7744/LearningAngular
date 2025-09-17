import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {
  countries = signal<Country[]>([]);

  onSearchRegion(region: string) {
    this.countries.set([]);
  }
}
