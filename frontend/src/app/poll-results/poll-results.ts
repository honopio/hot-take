import {
  Component,
  input,
  ViewChild,
  effect,
  HostListener,
} from '@angular/core';
import { ChartComponent, ApexOptions } from 'ng-apexcharts';
import { PollModel } from '../types/poll.types';

@Component({
  selector: 'app-poll-results',
  imports: [ChartComponent],
  templateUrl: './poll-results.html',
  styleUrl: './poll-results.scss',
})
export class PollResults {
  pollData = input<PollModel>();
  chart!: ChartComponent;
  public chartOptions!: Partial<ApexOptions>;
  private isMobile = window.innerWidth < 600;

  @HostListener('window:resize')
  onResize() {
    const newIsMobile = window.innerWidth < 600;
    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
      this.updateChartOptions();
    }
  }

  private updateChartOptions() {
    const data = this.pollData();
    if (!data || !data.options || data.options.length === 0) {
      return;
    }
    const maxVotes = Math.max(...data.options.map((o: any) => o.votes));
    const optionsNames = data.options.map((o: any) => o.text);
    const optionsVotes = data.options.map((o: any) => o.votes);
    this.chartOptions = {
      series: [
        {
          name: 'votes',
          data: optionsVotes,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: true,
          colors: {
            ranges: [
              {
                from: 0,
                to: 1000,
                color: '#f1704a',
              },
            ],
          },
        },
      },
      xaxis: {
        categories: optionsNames,
        max: maxVotes + 1,
        stepSize: 1,
        labels: {
          formatter: (value: string) => {
            return Number(value).toString();
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--color-text)',
            fontSize: window.innerWidth < 600 ? '12px' : '14px',
          },
          maxWidth: window.innerWidth < 600 ? 120 : 300,
        },
      },
      tooltip: {
        style: {
          fontSize: '14px',
        },
      },
      dataLabels: {
        enabled: false,
      },
    };
  }

  constructor() {
    effect(() => {
      this.updateChartOptions();
    });
  }
}
