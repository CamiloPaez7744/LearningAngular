import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavBarComponent } from "../../components/front-navBar/front-navBar.component";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavBarComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent { }
