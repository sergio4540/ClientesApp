import { User } from './user.model';

export interface Login {
  userName?: string;
  password?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
