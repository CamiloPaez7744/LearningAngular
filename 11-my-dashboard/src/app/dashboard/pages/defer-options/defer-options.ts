import { Component } from '@angular/core';
import { HeavyLoadersFast } from '@shared/heavy-loaders/heavy-loaders-fast';
import { Title } from "@shared/title/title";

@Component({
  selector: 'app-defer-options',
  imports: [Title, HeavyLoadersFast],
  templateUrl: './defer-options.html',
})
export class DeferOptions { }
