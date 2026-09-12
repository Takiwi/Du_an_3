export interface CreateAccountInput {
  username: string;
  email: string;
  password: string;
}

export interface CreateAccountOutput {
  id: string;
  username: string;
  email: string;
  role: string[];
  status: string;
}
