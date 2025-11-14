import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [RouterModule],
  templateUrl: './side-menu.html',
})
export class SideMenu {
  public menuItems = routes.map(route => route.children ?? []).flat()
    .filter(r => r.path && r.path !== '')
    .filter(r => !(r.path?.includes(':')));
}
