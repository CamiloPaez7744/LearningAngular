import { Component, input } from '@angular/core';
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-heavy-loaders-fast',
  imports: [],
  template: `
  <section [class]="'h-5 w-full ' + cssClass()">
    <ng-content></ng-content>
    Fast loader
  </section>
  `,
})
export class HeavyLoadersFast {
  cssClass = input.required<string>();

}
