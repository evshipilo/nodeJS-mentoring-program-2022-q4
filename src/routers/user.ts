import express, { NextFunction, Response } from 'express';
import UserService from '../services/userService';
import {
  userBodyValidatorOnCreate,
  userBodyValidatorOnUpdate,
  paramsIdValidator,
  userQuerySubstringLimitValidator,
  userBodyCredentialsValidator,
} from '../validation/validators';
import { User } from '../models/typeORMModels';
import { ValidatedRequest } from 'express-joi-validation';
import {
  CreateUserBodySchema,
  GetUserByCredentialsBodySchema,
  ParamsIDSchema,
  QuerySubstringLimitSchema,
  UpdateUserBodySchema,
} from '../validation/types';
import { methodLoggerMiddleware } from '../middlewares/methodLoggerMiddleware';
import * as jwt from 'jsonwebtoken';
import { LoginError } from '../customErrors';

export default function createUserRouter(userService: UserService) {
  const user = express.Router();

  user.post(
    '/user',
    userBodyValidatorOnCreate,
    methodLoggerMiddleware,
    async (
      req: ValidatedRequest<CreateUserBodySchema>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const user: User = { ...req.body };
        const result = await userService.createUser(user);
        res.status(200).json({ createdUser: result });
      } catch (e) {
        // pass error to errorHandler
        next(e);
      }
    }
  );

  user.get(
    '/user/:id',
    paramsIdValidator,
    methodLoggerMiddleware,
    async (
      req: ValidatedRequest<ParamsIDSchema>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { id } = req.params;
        const result = await userService.getUserById(id);
        res.status(200).json({ user: result });
      } catch (e) {
        next(e);
      }
    }
  );

  user.put(
    '/user/:id',
    userBodyValidatorOnUpdate,
    paramsIdValidator,
    methodLoggerMiddleware,
    async (
      req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { id } = req.params;
        const result = await userService.updateUser(id, req.body);
        res.status(200).json({ updatedUser: result });
      } catch (e) {
        next(e);
      }
    }
  );

  user.delete(
    '/user/:id',
    paramsIdValidator,
    methodLoggerMiddleware,
    async (
      req: ValidatedRequest<ParamsIDSchema>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res
          .status(200)
          .json({ message: `user with id ${id} marked as deleted` });
      } catch (e) {
        next(e);
      }
    }
  );

  user.get(
    '/users',
    userQuerySubstringLimitValidator,
    methodLoggerMiddleware,
    async (
      req: ValidatedRequest<QuerySubstringLimitSchema>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { loginsubstring } = req.query;
        const { limit } = req.query;

        const result = await userService.getUsers(loginsubstring, limit);
        res.status(200).json({ users: result });
      } catch (e) {
        next(e);
      }
    }
  );

  user.post(
    '/user/login',
    userBodyCredentialsValidator,
    async (
      req: ValidatedRequest<GetUserByCredentialsBodySchema>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { login, password } = req.body;
        const result = await userService.getUserByCredentials(login, password);

        if (result instanceof User) {
          const payload = { sub: 'api access', userId: result.id };
          const secret = process.env.SECRET as string;
          const token = jwt.sign(payload, secret, {
            expiresIn: `${process.env.EXPIRESIN}ms`,
          });
          res.status(200).json({ token });
        } else {
          throw new LoginError('Bad Username/Password combination');
        }
      } catch (e) {
        next(e);
      }
    }
  );

  return user;
}
