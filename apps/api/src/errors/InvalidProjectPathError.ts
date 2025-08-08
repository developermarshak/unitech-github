export class InvalidProjectPathError extends Error {
  constructor(message: string = "Invalid project path") {
    super(message);
    this.name = "InvalidProjectPathError";
  }
}
