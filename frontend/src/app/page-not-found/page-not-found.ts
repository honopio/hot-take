import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found',
  imports: [MatIcon, RouterLink],
  templateUrl: './page-not-found.html',
})
export class PageNotFound {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
