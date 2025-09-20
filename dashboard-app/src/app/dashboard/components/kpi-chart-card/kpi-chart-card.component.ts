import { NgClass } from '@angular/common';
import * as echarts from 'echarts';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartComponent } from "../../../shared/components/chart/chart.component";
import { ChartConfig, ChartData, ChartType } from '../../../shared/interfaces/chart.interface';

@Component({
  selector: 'app-kpi-card',
  imports: [NgClass, ChartComponent],
  templateUrl: './kpi-chart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  title = input<string>('KPI Title');
  value = input<string | number>('0');
  percentage = input<number>(0);
  trendUp = input<boolean>(true);
  color = input<string>('primary');
  chartData = input<ChartData>({
    labels: [],
    values: []
  });
  chartType = input<ChartType>('line1');

  lineChart = computed<ChartConfig>(() => ({
    type: this.chartType(),
    data: this.chartData(),
    style: {
      color: '#3b82f6'
    }
  }));
}
