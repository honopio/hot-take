export interface PollOption {
  optionId: string;
  text: string;
  votes: number;
}

export interface PollModel {
  _id: string;
  title: string;
  options: PollOption[];
  createdAt: string;
}
