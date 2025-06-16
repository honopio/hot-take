import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CreatePoll } from './create-poll/create-poll';
import { Poll } from './poll/poll';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'create', component: CreatePoll },
  { path: 'poll/:id', component: Poll },
];
