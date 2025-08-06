import { UserRepository } from '../../../repositories/userRepository';
import s from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { jwtConfig } from '../../../config/jwt';
import { ulid } from 'ulid';
import { AuthenticationError } from '../../../errors/AuthenticationError';
import { PasswordHasher } from '../../../security/passwordHasher';

@injectable()
export class CreateSessionUserCommand {
  constructor(
    @inject('UserRepository') private readonly userRepository: UserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(
    data: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    const sessionId = ulid();

    if (!user || !(await this.passwordHasher.verify(data.password, user.password))) {
      throw new AuthenticationError();
    }

    const accessToken = s.sign({ userId: user.id, sessionId }, jwtConfig.privateKey, {
      expiresIn: '365d',
    });

    return { accessToken };
  }
}
