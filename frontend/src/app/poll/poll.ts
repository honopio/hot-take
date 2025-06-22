import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-poll',
  imports: [RouterLink, MatIcon, FormsModule, NgClass],
  templateUrl: './poll.html',
})
export class Poll {
  pollData = signal<any>(null);
  selectedOption = '';
  successMessage = '';
  errorMessage = '';
  copied = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    const pollId = this.route.snapshot.params['id'];

    this.http.get(`/api/polls/${pollId}`).subscribe({
      next: (response) => {
        this.pollData.set(response);
      },
      error: (error) => {
        console.error('Error fetching poll:', error);
        this.errorMessage = 'Sorry, we could not find that poll.';
      },
    });

    const nav = window.history.state;
    if (nav && nav.success) {
      this.successMessage = 'Poll created!';
      history.replaceState({}, document.title);
    }
  }

  get pollId() {
    return this.route.snapshot.params['id'];
  }

  get hasVoted(): boolean {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    return votedPolls.includes(this.pollId);
  }

  set hasVoted(value: boolean) {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    if (value && !votedPolls.includes(this.pollId)) {
      votedPolls.push(this.pollId);
      localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
    }
  }

  submitVote() {
    if (!this.selectedOption || this.hasVoted) {
      return;
    }
    this.http
      .post(`/api/polls/${this.pollId}/vote`, {
        optionId: this.selectedOption,
      })
      .subscribe({
        next: (response) => {
          this.hasVoted = true;
          this.successMessage = 'Thank you for voting!';
        },
        error: (error) => {
          console.error('Error submitting vote:', error);
          this.errorMessage = 'Error submitting your vote. Please try again.';
        },
      });
  }

  get pollLink() {
    return this.pollId ? `${window.location.origin}/poll/${this.pollId}` : '';
  }

  copyLink() {
    navigator.clipboard.writeText(this.pollLink).then(() => {
      this.copied = true;
    });
  }
}
