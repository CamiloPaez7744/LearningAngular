import { Component, input } from '@angular/core';

@Component({
  selector: 'app-heavy-loaders-slow',
  imports: [],
  template: `
  <section [class]="'h-[600px] w-full ' + cssClass()">Slow loader</section>
  `,
})
export class HeavyLoadersSlow {

  cssClass = input.required<string>();

  constructor() {
    console.log('Starting heavy computation...');
    const start = Date.now();
    while (Date.now() - start < 3000) {
      // Simulate heavy computation for 3 seconds
    }
  }
}
