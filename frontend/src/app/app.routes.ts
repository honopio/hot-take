import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CreatePoll } from './create-poll/create-poll';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'create', component: CreatePoll },
];
