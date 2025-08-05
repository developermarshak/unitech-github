import { injectable, inject } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';

@injectable()
export class UserRepository {
  private userRepository: Repository<User>;

  constructor(@inject('DataSource') private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);//todo: declare in container and load in handlers
  }

  create(data: { id: string; email: string; password: string }): Promise<User> {
    const user = this.userRepository.create({ ...data, created_at: new Date() });
    return this.userRepository.save(user);
  }
}
