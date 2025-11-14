import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenu } from "../shared/side-menu/side-menu";
import { routes } from '../app.routes';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, SideMenu],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  public menuItems = routes.map(route => route.children ?? []).flat()
    .filter(r => r.path && r.path !== '')
    .filter(r => !(r.path?.includes(':')));

  constructor() {

  }
}
