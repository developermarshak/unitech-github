import { UserRepository } from "../../../repositories/userRepository.js";
import s from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { jwtConfig } from "../../../config/jwt.js";
import { ulid } from "ulid";
import { AuthenticationError } from "../../../errors/AuthenticationError.js";
import { PasswordHasher } from "../../../security/passwordHasher.js";

@injectable()
export class CreateSessionUserCommand {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("PasswordHasher") private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    const sessionId = ulid();

    if (
      !user ||
      !(await this.passwordHasher.verify(data.password, user.password))
    ) {
      throw new AuthenticationError();
    }
    //move to utils (jwt signer)
    const accessToken = s.sign(
      { userId: user.id, sessionId },
      jwtConfig.privateKey,
      {
        expiresIn: "365d",
        algorithm: "RS256",
      },
    );

    return { accessToken };
  }
}
