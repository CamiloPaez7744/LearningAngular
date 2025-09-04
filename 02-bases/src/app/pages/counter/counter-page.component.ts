import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter-page.component.html',
  styleUrls: ['./counter-page.component.css']
})

export class CounterPageComponent {
  counter: number = 0;
  counterSignal = signal(10);

  increaseBy(value: number) {
    this.counter += value;
    // this.counterSignal.set(this.counterSignal() + value);
    this.counterSignal.update( (current) => current + value);
  }

  reset() {
    this.counter = 0;
    this.counterSignal.set(this.counter);
  }
}
