import { Component, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { PollResults } from '../poll-results/poll-results';
import { PollModel } from '../types/poll.types';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-poll',
  imports: [RouterLink, MatIcon, FormsModule, NgClass, PollResults],
  templateUrl: './poll.html',
})
export class Poll implements OnDestroy {
  pollData = signal<PollModel>({
    _id: '',
    title: '',
    options: [],
    createdAt: '',
  });
  selectedOption = '';
  successMessage = '';
  errorMessage = '';
  copied = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {
    this.fetchPoll();
    this.setupSocketListeners();

    const nav = window.history.state;
    if (nav && nav.success) {
      this.successMessage = 'Poll created!';
      history.replaceState({}, document.title);
    }
  }

  ngOnDestroy() {
    // remove socket listeners when component is destroyed
    this.socketService.removeVotesListener();
    this.socketService.leavePoll(this.pollId);
  }

  private setupSocketListeners() {
    // Join the poll room and listen for vote updates
    this.socketService.joinPoll(this.pollId);
    this.socketService.onVotesUpdated((updatedPollData) => {
      console.log('Real-time poll update received:', updatedPollData);
      this.pollData.set(updatedPollData);
    });
  }

  fetchPoll() {
    const pollId = this.route.snapshot.params['id'];
    this.http.get(`/api/polls/${pollId}`).subscribe({
      next: (response) => {
        this.pollData.set(response as PollModel);
      },
      error: (error) => {
        console.error('Error fetching poll:', error);
        this.errorMessage = 'Sorry, we could not find that poll.';
      },
    });
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
