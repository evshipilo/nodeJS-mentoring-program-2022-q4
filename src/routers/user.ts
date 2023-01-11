import express from 'express';
import { UserService } from '../services/userService';
import {
  userBodyValidatorOnCreate,
  userBodyValidatorOnUpdate,
  paramsIdValidator,
  userQuerySubstringLimitValidator,
} from '../validation/validators';
import { User } from '../models/typeORMModels';
import { methodLogger } from '../middlewares/methodLogger';

const user = express.Router();
const userService = new UserService();

user.post('/user', userBodyValidatorOnCreate, async (req, res) => {
  const user: User = { ...req.body };
  const result = await userService.createUser(user);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    res.status(200).json({ createdUser: result });
  }
});

user.get('/user/:id', paramsIdValidator, async (req, res) => {
  const { id } = req.params;
  const result = await userService.getUserById(id);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    result
      ? res.status(200).json({ user: result })
      : res.status(404).json({ message: `no users with id ${id}` });
  }
});

user.put(
  '/user/:id',
  userBodyValidatorOnUpdate,
  paramsIdValidator,
  async (req, res) => {
    const { id } = req.params;
    const result = await userService.updateUser(id, req.body);
    if (result instanceof Error) {
      res.status(500).json({ message: result });
    } else {
      result
        ? res.status(200).json({ updatedUser: result })
        : res.status(404).json({ message: `no users with id ${id}` });
    }
  }
);

user.delete('/user/:id', paramsIdValidator, async (req, res) => {
  const { id } = req.params;
  const result = await userService.deleteUser(id);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    result
      ? res
          .status(200)
          .json({ message: `user with id ${id} marked as deleted` })
      : res.status(404).json({ message: `no users with id ${id}` });
  }
});

user.get('/users', userQuerySubstringLimitValidator, methodLogger, async (req, res) => {
  const substring = req.query.login_substring as string;
  const limit = req.query.limit as string;

  const result = await userService.getUsers(limit, substring);
  
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    res.status(200).json({ users: result });
  }
});

export default user;
