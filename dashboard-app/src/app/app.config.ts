import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { GeoComponent, GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideEchartsCore({ echarts })
  ]
};

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GeoComponent,
  ScatterChart,
  CanvasRenderer,
  LineChart,
  ScatterChart,
  BarChart,
  PieChart,
  CanvasRenderer
])
