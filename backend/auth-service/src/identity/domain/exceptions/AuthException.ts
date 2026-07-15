export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User với email ${email} đã tồn tại trong hệ thống.`);
    this.name = 'UserAlreadyExistsException';
  }
}
