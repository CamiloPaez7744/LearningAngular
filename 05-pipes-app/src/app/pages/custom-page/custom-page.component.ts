import { Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { heroes } from '../../data/hero.data';
import { Hero } from '../../interfaces/hero.interface';
import {
  canFlyCasePipe,
  HeroColorCasePipe,
  HeroCreatorPipe,
  HeroMapColorPipe,
  HeroSortByPipe,
  ToggleCasePipe,
  HeroFilterPipe
} from '../../pipes';

@Component({
  selector: 'app-custom-page',
  imports: [
    ToggleCasePipe,
    canFlyCasePipe,
    HeroColorCasePipe,
    HeroMapColorPipe,
    TitleCasePipe,
    HeroCreatorPipe,
    HeroSortByPipe,
    HeroFilterPipe
],
  templateUrl: './custom-page.component.html',
})
export class CustomPageComponent {
  sampleText = signal('Hello World!');

  upperCase = signal(true);
  heroes = signal(heroes);
  sortBy = signal<keyof Hero | null>(null);
  searchTerm = signal('');

  toggleCase() {
    this.upperCase.set(!this.upperCase());
  }
}
