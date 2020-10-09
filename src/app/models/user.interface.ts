import { MenuItem } from './menuItem.interface';

export interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipo_actor_id?: Roles;
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

export type Roles = 2;
