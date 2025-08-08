import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ZodError } from "zod";
import { CreateUserCommand } from "../../handlers/user/commands/createUserCommand.js";
import { CreateSessionUserCommand } from "../../handlers/user/commands/createSessionUserCommand.js";
import { ValidationError } from "../../errors/ValidationError.js";
import {
  createUserRequestSchema,
  createSessionRequestSchema,
} from "@repo/contracts";

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserCommand)
    private readonly createUserCommand: CreateUserCommand,
    @inject(CreateSessionUserCommand)
    private readonly createSessionUserCommand: CreateSessionUserCommand,
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Validate and coerce request body
      const data = createUserRequestSchema.parse(req.body);
      await this.createUserCommand.execute(data);
      res.status(201).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError("Invalid request data", error.errors));
      }
      next(error);
    }
  }

  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSessionRequestSchema.parse(req.body);
      const { accessToken } = await this.createSessionUserCommand.execute(data);
      res.json({ accessToken });
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError("Invalid request data", error.errors));
      }
      next(error);
    }
  }
}
