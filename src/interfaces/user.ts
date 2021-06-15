export interface UserCreate {
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
}

export interface UserUpdate {
  email?: string;
  username?: string;
  password?: string;
  status?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}
