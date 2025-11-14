import { Component, signal } from '@angular/core';

type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

const GRADES: readonly Grade[] = ['A', 'B', 'C', 'D', 'F'] as const;

@Component({
  selector: 'app-control-flow',
  imports: [],
  templateUrl: './control-flow.html',
})
export class ControlFlow {
  public showContent = signal(false);
  public grade = signal<Grade>('A');
  public readonly availableGrades = GRADES;

  public toggleContent(): void {
    this.showContent.set(!this.showContent());
  }
}
