import { MenuItem } from './menuItem.interface';

export interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserResponse {
  status: string;
  msg: string;
  token: string;
  userId: number;
  email: string;
  role: number;
  user: [];
  menu?: MenuItem[];
}
