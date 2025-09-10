import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '@gifs/interfaces/giphy.interface';

@Injectable({providedIn: 'root'})
export class GifsService {
  constructor() { }

  private http = inject(HttpClient);

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyApi.serviceUrl}/trending`, {
      params: {
        api_key: `${environment.giphyApi.apiKey}`,
        limit: '25',
        rating: 'g'
      }
    });
  }
}
