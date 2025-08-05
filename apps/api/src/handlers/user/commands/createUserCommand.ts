import { inject, injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { UserRepository } from '../../../repositories/userRepository';

@injectable()
export class CreateUserCommand {
  constructor(@inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    const id = ulid();
    const hashedPassword = "123"; //todo: hash password
    return this.userRepository.create({ id, email: data.email, password: hashedPassword });
  }
}
