import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KpiCardComponent } from "../../components/kpi-chart-card/kpi-chart-card.component";
import { ChartType } from '../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-kpi-page',
  imports: [KpiCardComponent],
  templateUrl: './kpi-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiPageComponent {
  chartTypes: ChartType[] = ['line1', 'line2', 'line3', 'line4', 'line5', 'bar-vertical', 'bar-horizontal', 'pie', 'doughnut'];

  kpis = [
    {
      title: 'Ingresos',
      value: '$9,000',
      percentage: 40.9,
      trendUp: true,
      chartType: this.chartTypes[0],
      chartData: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        values: [3, 5, 8, 12, 7, 10, 15]
      }
    },
    {
      title: 'Usuarios activos',
      value: '1,250',
      percentage: 12.3,
      trendUp: false,
      chartType: this.chartTypes[5],
      chartData: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        values: [10, 12, 9, 8, 7, 6, 5]
      }
    },
    {
      title: 'Conversiones',
      value: '2,340',
      percentage: 18.5,
      trendUp: true,
      chartType: this.chartTypes[8],
      chartData: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        values: [2, 3, 4, 6, 7, 9, 11]
      }
    },
  ];
}
