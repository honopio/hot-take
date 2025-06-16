import { Component, inject, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-poll',
  imports: [MatIcon, RouterLink, FormsModule],
  templateUrl: './create-poll.html',
  styleUrl: './create-poll.scss',
})
export class CreatePoll {
  constructor(private http: HttpClient) {}

  @ViewChild('pollForm') pollForm!: NgForm;
  options: string[] = ['', ''];
  pollTitle: string = '';
  private router = inject(Router);

  addOption() {
    if (this.options.length < 10) {
      this.options.push('');
    }
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.splice(index, 1);
    }
  }

  resetForm() {
    this.pollTitle = '';
    this.options = ['', ''];

    // Reset the form's validation state
    if (this.pollForm) {
      this.pollForm.resetForm({
        pollTitle: '',
        option0: '',
        option1: '',
      });
    }
  }

  createPoll() {
    if (this.pollTitle === '' || this.options.some((option) => option === '')) {
      return;
    }

    this.http
      .post('/api/polls', { title: this.pollTitle, options: this.options })
      .subscribe({
        next: (response) => {
          const newPollId = (response as any)._id;
          this.router.navigate([`/poll/${newPollId}`]);
        },
        error: (error) => {
          console.error('Error creating poll:', error);
        },
      });

    this.resetForm();
  }
}
