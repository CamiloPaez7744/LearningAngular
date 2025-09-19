import { NgClass } from '@angular/common';
import * as echarts from 'echarts';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-kpi-card',
  imports: [NgClass, NgxEchartsDirective],
  templateUrl: './kpi-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  title = input<string>('KPI Title');
  value = input<string | number>('0');
  percentage = input<number>(0);
  trendUp = input<boolean>(true);
  color = input<string>('primary');
  chartData = input<any>(null);
  sparklineData = input<number[]>([5, 8, 6, 10, 9, 12, 14]);

  get chartOptions() {
    return {
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false },
      series: [
        {
          data: this.sparklineData(),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: this.trendUp() ? '#22c55e' : '#ef4444' },
          areaStyle: {
            opacity: 0.2,
            color: this.trendUp() ? '#22c55e' : '#ef4444'
          }
        }
      ]
    };
  }
}
