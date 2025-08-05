import { Request, Response, NextFunction } from 'express';
import { container } from '../../container';
import { CreateUserCommand } from '../../handlers/user/commands/createUserCommand';

export class UserController {

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const command = container.resolve(CreateUserCommand);
      const user = await command.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}
