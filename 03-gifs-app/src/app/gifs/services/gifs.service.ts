import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Gif } from '@gifs/interfaces/gif.interface';
import type { GiphyResponse } from '@gifs/interfaces/giphy.interface';
import { GifMapper } from '@gifs/mapper/gif.mapper';

@Injectable({ providedIn: 'root' })
export class GifsService {
  constructor() { }

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

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
      console.log({ response });
    });
  }
}
