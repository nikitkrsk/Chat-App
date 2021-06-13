export interface AdminCreate {
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  role: string;
  contactInfo?: object;
}

export interface AdminUpdate {
  email?: string;
  username?: string;
  password?: string;
  status?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  contactInfo?: object;
}
