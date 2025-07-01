import { Component, input, effect, HostListener } from '@angular/core';
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

  constructor() {
    effect(() => {
      this.updateChartOptions();
    });
  }

  @HostListener('window:resize')
  onResize() {
    const newIsMobile = window.innerWidth < 600;
    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
      this.updateChartOptions();
    }
  }

  get totalVotes(): number {
    const data = this.pollData();
    if (!data?.options) return 0;
    let total = 0;
    for (const option of data.options) {
      total += option.votes;
    }
    return total;
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
        height: Math.max(300, data.options.length * 60),
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
          style: {
            colors: 'var(--color-text)',
          },
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
        intersect: false,
        style: {
          fontSize: '14px',
        },
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            yaxis: {
              labels: {
                style: {
                  fontSize: '11px',
                },
                maxWidth: 100,
              },
            },
          },
        },
      ],
    };
  }
}
