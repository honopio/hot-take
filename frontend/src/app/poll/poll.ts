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

  constructor() {
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

  submitVote() {
    if (!this.selectedOption) {
      return;
    }
    this.http
      .post(`/api/polls/${this.pollData()._id}/vote`, {
        optionId: this.selectedOption,
      })
      .subscribe({
        next: (response) => {
          console.log('Vote submitted successfully:', response);
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
