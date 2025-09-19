import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KpiCardComponent } from "../../components/kpi-card/kpi-card.component";

@Component({
  selector: 'app-kpi-page',
  imports: [KpiCardComponent],
  templateUrl: './kpi-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiPageComponent {
  kpis = [
    {
      title: 'Ingresos',
      value: '$9,000',
      percentage: 40.9,
      trendUp: true,
      sparkline: [5, 6, 8, 12, 14, 10, 16],
    },
    {
      title: 'Usuarios activos',
      value: '1,250',
      percentage: 12.3,
      trendUp: false,
      sparkline: [10, 12, 9, 8, 7, 6, 5],
    },
    {
      title: 'Conversiones',
      value: '2,340',
      percentage: 18.5,
      trendUp: true,
      sparkline: [2, 3, 4, 6, 7, 9, 11],
    },
  ];
}
