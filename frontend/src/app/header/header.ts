import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIcon, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  isDark: boolean = false;

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    this.isDark = saved === 'dark' ? true : false;
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light'); //persist item in case of refresh
  }
}
