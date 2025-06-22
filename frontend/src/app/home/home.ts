import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HomeCard } from '../home-card/home-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HomeCard, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  constructor(private router: Router) {}
  pollInput: string = '';

  joinPoll(pollInput: string) {
    let pollId = pollInput.trim();
    const match = pollId.match(/\/poll\/([a-zA-Z0-9]+)/);
    if (match) {
      pollId = match[1]; // only extract the id part (between () in the regex)
    }
    this.router.navigate(['/polls', pollId]);
  }
}
