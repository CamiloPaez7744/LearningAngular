import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  onSearchCapital(capital: string) {
    this.countryService.searchByCapital(capital).subscribe({
      next: (countries) => {
        console.log({ countries });
      },
      error: (error) => {
        console.error({ error });
      }
    });
  }
}
