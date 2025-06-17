import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HomeCard } from '../home-card/home-card';

@Component({
  selector: 'app-home',
  imports: [MatIcon, RouterLink, HomeCard],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  private router = inject(Router);

  joinPoll(pollInput: string) {
    let pollId = pollInput.trim();
    const match = pollId.match(/\/poll\/([a-zA-Z0-9]+)/);
    if (match) {
      pollId = match[1]; // only extract the id part (between () in the regex)
    }
    this.router.navigate(['/poll', pollId]);
  }
}
