import { inject, injectable } from "tsyringe";
import { ulid } from "ulid";
import { UserRepository } from "../../../repositories/userRepository.js";
import { PasswordHasher } from "../../../security/passwordHasher.js";
import { UserAlreadyExistsError } from "../../../errors/UserAlreadyExistsError.js";

@injectable()
export class CreateUserCommand {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("PasswordHasher") private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(data: { email: string; password: string }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }
    const id = ulid();
    const hashedPassword = await this.passwordHasher.hash(data.password);

    return this.userRepository.create({
      id,
      email: data.email,
      password: hashedPassword,
    });
  }
}
