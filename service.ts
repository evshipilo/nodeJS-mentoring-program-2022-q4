import express from 'express';
import crypto from 'node:crypto';
import bodyParser from 'body-parser';
import { createValidator } from 'express-joi-validation';
import {
  createUserBodySchema,
  paramsIDSchema,
  paramsSubstringLimitSchema,
  updateUserBodySchema,
} from './schemas';
import type { User } from './types';

const app = express();
const validator = createValidator();

app.listen(3000);

const users: User[] = [];

app.use(bodyParser.json());

// get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// get user by ID
app.get('/user/:id', validator.params(paramsIDSchema), (req, res) => {
  res.json(users.filter((user) => user.id === req.params.id));
});

// create user
app.post('/user', validator.body(createUserBodySchema), (req, res) => {
  const user = { ...req.body, id: crypto.randomUUID() };
  users.push(user);
  res.json(user);
});

//update user
app.put(
  '/user/:id',
  validator.params(paramsIDSchema),
  validator.body(updateUserBodySchema),
  (req, res) => {
    const index = users.findIndex((user) => user.id === req.params.id);
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  }
);

//delete user
app.put('/user/delete/:id', validator.params(paramsIDSchema), (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  users[index] = { ...users[index], isDeleted: true };
  res.json(users[index]);
});

// filter users on limit
app.get(
  '/users/:loginSubstring/:limit',
  validator.params(paramsSubstringLimitSchema),
  (req, res) => {
    const filteredUsers = users.filter((user) =>
      user.login.includes(req.params.loginSubstring)
    );
    const sortedUsers = filteredUsers.sort();
    res.json(sortedUsers.splice(0, +req.params.limit));
  }
);
