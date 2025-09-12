import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifListComponent } from "@gifs/components/gif-list/gif-list.component";
import { Gif } from '@gifs/interfaces/gif.interface';
import { GifsService } from '@gifs/services/gifs.service';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  public gifsService = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifsService.searchGifs(query).subscribe((gifs) => {
      this.gifs.set(gifs);
    });
  }
}
