export interface User {
  name: string;
  password: string;
}

export interface UserResponse {
  status: string;
  msg: string;
  token: string;
  userId: number;
  role: number;
}
