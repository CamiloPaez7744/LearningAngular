import { Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
})
export class TitleComponent implements OnChanges {
  title = input.required<string>();

  ngOnChanges(changes: SimpleChanges) {
    console.log('TitleComponent ngOnChanges', changes);

    for(const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Input ${inputName} changed from ${inputValues.previousValue} to ${inputValues.currentValue}`);
      console.log(`Is first change: ${inputValues.firstChange}`);
    }
  }
}
