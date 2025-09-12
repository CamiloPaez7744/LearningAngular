import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Gif } from '@gifs/interfaces/gif.interface';
import type { GiphyResponse } from '@gifs/interfaces/giphy.interface';
import { GifMapper } from '@gifs/mapper/gif.mapper';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GifsService {
  constructor() { }

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyApi.serviceUrl}/trending`, {
      params: {
        api_key: `${environment.giphyApi.apiKey}`,
        limit: '25',
        rating: 'g'
      }
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyListToGifList(response.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log({ response });
    });
  }

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyApi.serviceUrl}/search`, {
      params: {
        api_key: `${environment.giphyApi.apiKey}`,
        q: query,
        limit: '25',
        offset: '0',
        rating: 'g',
        lang: 'en'
      }
    }).pipe(
      map(({ data }) => GifMapper.mapGiphyListToGifList(data)),
      tap(gifs => console.log({ search: gifs }))
    );

    // .subscribe((response) => {
    //   const gifs = GifMapper.mapGiphyListToGifList(response.data);
    //   console.log({ search: gifs });
    // }
    // );
  }
}
