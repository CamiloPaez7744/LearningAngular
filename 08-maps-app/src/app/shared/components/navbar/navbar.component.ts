import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  router = inject(Router);

  routes = routes.map((route) => ({
    path: route.path,
    title: route.title ?? (route.path ? route.path.charAt(0).toUpperCase() + route.path.slice(1) : ''),
  })).filter((route) => route.path !== '**');

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    tap(() => {
      const currentRoute = this.routes.find((route) => route.path === this.router.url.slice(1));
      document.title = currentRoute ? `MapsApp - ${currentRoute.title}` : 'MapsApp';
    }),
    map(() => {
      const currentRoute = this.routes.find((route) => route.path === this.router.url.slice(1));
      return currentRoute ? currentRoute.title : 'MapsApp';
    })
  );

  // as signal
  pageTitle = toSignal(this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    tap(() => {
      const currentRoute = this.routes.find((route) => route.path === this.router.url.slice(1));
      document.title = currentRoute ? `MapsApp - ${currentRoute.title}` : 'MapsApp';
    }),
    map(() => {
      const currentRoute = this.routes.find((route) => route.path === this.router.url.slice(1));
      return currentRoute ? currentRoute.title : 'MapsApp';
    })
  ));
}
