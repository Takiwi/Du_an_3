export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;

  constructor(
    id: string,
    username: string,
    email: string,
    status: string,
    role: string,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.status = status;
    this.role = role;
  }
}
