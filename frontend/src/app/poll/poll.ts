import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-poll',
  imports: [RouterLink, MatIcon, FormsModule],
  templateUrl: './poll.html',
})
export class Poll {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  pollData = signal<any>(null);
  selectedOption = '';

  constructor() {
    const pollId = this.route.snapshot.params['id'];
    this.http.get(`/api/polls/${pollId}`).subscribe({
      next: (response) => {
        console.log('Poll data:', response);
        this.pollData.set(response);
      },
      error: (error) => console.error('Error fetching poll:', error),
    });
  }

  submitVote() {
    console.log('Submitting vote', this.selectedOption);
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
}
