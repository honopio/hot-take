import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io();
  }

  joinPoll(pollId: string) {
    this.socket.emit('joinPoll', pollId);
  }

  leavePoll(pollId: string) {
    this.socket.emit('leavePoll', pollId);
  }

  onVotesUpdated(callback: (data: any) => void) {
    this.socket.on('votesUpdated', callback);
  }

  removeVotesListener() {
    this.socket.off('votesUpdated');
  }
}
