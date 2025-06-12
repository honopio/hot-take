import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatIcon, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {}
