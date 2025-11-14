import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from '../app.routes';
import { SideMenu } from '@shared/side-menu/side-menu';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, SideMenu],
  templateUrl: './dashboard.html',
})
export class Dashboard { }
