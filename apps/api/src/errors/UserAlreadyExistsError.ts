export class UserAlreadyExistsError extends Error {
  constructor(message: string = "User with this email already exists") {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}
