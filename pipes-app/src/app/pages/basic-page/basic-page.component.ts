import { DatePipe, LowerCasePipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-basic-page',
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, SlicePipe, DatePipe],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  nameLower = signal('batman');
  nameUpper = signal('BATMAN');
  fullName = signal('Bruce Wayne');

  customDate = signal(new Date());

  tickingDateEffect = effect((onCleanup) => {
    const interval = setInterval(() => {
      this.customDate.set(new Date());
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });
}
