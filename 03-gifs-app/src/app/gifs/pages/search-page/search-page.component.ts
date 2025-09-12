import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifListComponent } from "@gifs/components/gif-list/gif-list.component";
import { Gif } from '@gifs/interfaces/gif.interface';
import { GifService } from '@gifs/services/gif.service';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  public gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe((gifs) => {
      this.gifs.set(gifs);
    });
  }
}
