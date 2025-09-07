import { Routes } from '@angular/router';
import { CounterPageComponent } from './pages/counter/counter-page.component';
import { HeroPageComponent } from './pages/hero/hero-page.component';
import { DragonBallPageComponent } from './pages/dragonball/dragon-ball-page.component';
import { DragonBallSuperPageComponent } from './pages/dragonball-super/dragon-ball-super-page.component';

export const routes: Routes = [
  { path: '', component: CounterPageComponent },
  { path: 'hero', component: HeroPageComponent },
  { path: 'dragon-ball', component: DragonBallPageComponent },
  { path: 'dragon-ball-super', component: DragonBallSuperPageComponent },
  { path: '**', redirectTo: ''  }
];
