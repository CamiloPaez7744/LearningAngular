import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Title } from "@shared/title/title";

@Component({
  selector: 'app-change-detection',
  imports: [Title, JsonPipe],
  templateUrl: './change-detection.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDetection {
  public frameworkAsSignal = signal({ name: 'Angular', popular: true });

  public frameworkAsAttribute = { name: 'React', popular: true };

  constructor() {
    setTimeout(() => {
      this.frameworkAsSignal.set({ name: 'Vue', popular: true });
      // this.frameworkAsAttribute.name = 'Vue';
    }, 3000);
  }
}
