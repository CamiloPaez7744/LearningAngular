import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GifListComponent } from "@gifs/components/gif-list/gif-list.component";
import { GifsService } from '@gifs/services/gifs.service';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  public gifsService = inject(GifsService);

  onSearch(query: string) {
    this.gifsService.searchGifs(query);
  }
}
