import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScrollStateService {
  trendingScrollPosition = signal(0);

  constructor() { }

}
