import { inject, injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { UserRepository } from '../../../repositories/userRepository';
import { hashPassword } from '../../../utils/passwordHasher';

@injectable()
export class CreateUserCommand {
  constructor(@inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    const id = ulid();
    const hashedPassword = await hashPassword(data.password);
    return this.userRepository.create({ id, email: data.email, password: hashedPassword });
  }
}
