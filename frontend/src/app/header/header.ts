import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark); // adds dark class to the html element if isDark
  }
}
