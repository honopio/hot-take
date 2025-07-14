import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home-card',
  imports: [MatIcon],
  template: `<div class="rounded-xl p-8 border border-text h-full">
    <div
      [class]="
        'w-16 h-16 rounded-full border border-black flex items-center justify-center mb-6 mx-auto bg-' +
        color()
      "
    >
      <mat-icon fontIcon="{{ icon() }}" style="color: black"></mat-icon>
    </div>
    <h3 class="text-center">{{ title() }}</h3>
    <p class="text-secondary-text text-center">{{ description() }}</p>
  </div>`,
})
export class HomeCard {
  icon = input('bar_chart');
  title = input('Polls');
  description = input('');
  color = input('primary');
}
