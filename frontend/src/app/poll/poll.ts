import { Component, inject, signal } from '@angular/core';
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
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  pollData = signal<any>(null);
  selectedOption = '';
  successMessage = '';
  errorMessage = '';
  copied = false;
  hasVoted = signal<boolean>(false);

  constructor() {
    const pollId = this.route.snapshot.params['id'];
    this.checkIfVoted(pollId);

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

  checkIfVoted(pollId: string) {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    if (votedPolls.includes(pollId)) {
      this.hasVoted.set(true);
    }
  }

  submitVote() {
    if (!this.selectedOption || this.hasVoted()) {
      return;
    }

    const pollId = this.pollData()._id;

    this.http
      .post(`/api/polls/${pollId}/vote`, {
        optionId: this.selectedOption,
      })
      .subscribe({
        next: (response) => {
          // Mark this poll as voted in localStorage
          const votedPolls = JSON.parse(
            localStorage.getItem('votedPolls') || '[]'
          );
          votedPolls.push(pollId);
          localStorage.setItem('votedPolls', JSON.stringify(votedPolls));

          this.hasVoted.set(true);
          this.successMessage = 'Thank you for voting!';
        },
        error: (error) => {
          console.error('Error submitting vote:', error);
          this.errorMessage = 'Error submitting your vote. Please try again.';
        },
      });
  }

  get pollLink() {
    const pollId = this.route.snapshot.params['id'];
    return pollId ? `${window.location.origin}/poll/${pollId}` : '';
  }

  copyLink() {
    navigator.clipboard.writeText(this.pollLink).then(() => {
      this.copied = true;
    });
  }
}
