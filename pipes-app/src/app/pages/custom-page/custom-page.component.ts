import { Component, signal } from '@angular/core';
import { ToggleCasePipe } from '../../pipes/toggle-case.pipe';
import { heroes } from '../../data/hero.data';
import { canFlyCasePipe } from '../../pipes/can-fly-case.pipe';
import { HeroColorCasePipe } from '../../pipes/hero-color-case.pipe';

@Component({
  selector: 'app-custom-page',
  imports: [ToggleCasePipe, canFlyCasePipe, HeroColorCasePipe],
  templateUrl: './custom-page.component.html',
})
export class CustomPageComponent {
  sampleText = signal('Hello World!');

  upperCase = signal(true);
  heroes = signal(heroes);

  toggleCase() {
    this.upperCase.set(!this.upperCase());
  }
 }
