import { Component, signal } from '@angular/core';
import { Title } from "@shared/title/title";

type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

const GRADES: readonly Grade[] = ['A', 'B', 'C', 'D', 'F'] as const;

@Component({
  selector: 'app-control-flow',
  imports: [Title],
  templateUrl: './control-flow.html',
})
export class ControlFlow {
  public showContent = signal(false);
  public grade = signal<Grade>('A');
  public readonly availableGrades = GRADES;

  public frameworks = signal([
    { name: 'Angular', popular: true },
    { name: 'React', popular: true },
    { name: 'Vue', popular: true },
    { name: 'Svelte', popular: false },
  ]);
  public newFrameworkName = signal('');

  public toggleContent(): void {
    this.showContent.set(!this.showContent());
  }
}
