import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Gif } from '@gifs/interfaces/gif.interface';
import type { GiphyResponse } from '@gifs/interfaces/giphy.interface';
import { GifMapper } from '@gifs/mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'searchHistory';

const loadFromLocalStorage = (): Record<string, Gif[]> => {
  const historyString = localStorage.getItem(GIF_KEY) || '{}';
  return JSON.parse(historyString) as Record<string, Gif[]>;
}

@Injectable({ providedIn: 'root' })
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

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

  searchGifs(query: string): Observable<Gif[]> {
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
      tap(gifs => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: gifs
        }));
      })
    );

    // .subscribe((response) => {
    //   const gifs = GifMapper.mapGiphyListToGifList(response.data);
    //   console.log({ search: gifs });
    // }
    // );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query.toLowerCase()] || [];
  }
}
