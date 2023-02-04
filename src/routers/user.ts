import express, { NextFunction, Response } from 'express';
import { UserService } from '../services/userService';
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
import { checkTokenMiddleware } from '../middlewares/checkTokenMiddleware';

const user = express.Router();
const userService = new UserService();

user.post(
  '/user',
  userBodyValidatorOnCreate,
  methodLoggerMiddleware,
  checkTokenMiddleware,
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
  checkTokenMiddleware,
  async (
    req: ValidatedRequest<ParamsIDSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await userService.getUserById(id);
      result
        ? res.status(200).json({ user: result })
        : res.status(404).json({ message: `no users with id ${id}` });
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
  checkTokenMiddleware,
  async (
    req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await userService.updateUser(id, req.body);
      result
        ? res.status(200).json({ updatedUser: result })
        : res.status(404).json({ message: `no users with id ${id}` });
    } catch (e) {
      next(e);
    }
  }
);

user.delete(
  '/user/:id',
  paramsIdValidator,
  methodLoggerMiddleware,
  checkTokenMiddleware,
  async (
    req: ValidatedRequest<ParamsIDSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      result
        ? res
            .status(200)
            .json({ message: `user with id ${id} marked as deleted` })
        : res.status(404).json({ message: `no users with id ${id}` });
    } catch (e) {
      next(e);
    }
  }
);

user.get(
  '/users',
  userQuerySubstringLimitValidator,
  methodLoggerMiddleware,
  checkTokenMiddleware,
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

user.post('/authenticate', userBodyCredentialsValidator, function () {
  async (
    req: ValidatedRequest<GetUserByCredentialsBodySchema>,
    res: Response,
    next: NextFunction
  ) => {
    console.log('>>>>');
    
    try {
      const { login, password } = req.body;

      const result = await userService.getUserByCredentials(login, password);

      if (result instanceof User) {
        const payload = { sub: result.id };
        const secret = process.env.SECRET as string;
        const token = jwt.sign(payload, secret, { expiresIn: '10000ms' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Bad Username/Passsword combination' });
      }
    } catch (e) {
      next(e);
    }
  };
});

export default user;
