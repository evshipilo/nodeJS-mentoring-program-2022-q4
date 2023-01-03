import express from 'express';
import { randomUUID } from 'crypto';
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

const users: User[] = [];

app.use(bodyParser.json());

// // get all users
// app.get('/users', (req, res) => {
//   res.json(users);
// });

// get user by ID
app.get('/user/:id', validator.params(paramsIDSchema), (req, res) => {
  const filteredUsers = users.filter((user) => user.id === req.params.id);
  if (filteredUsers.length) {
    res.status(200).json({ users: filteredUsers });
  } else {
    res.status(404).json({ message: `no user with id ${req.params.id}` });
  }
});

// create user
app.post('/user', validator.body(createUserBodySchema), (req, res) => {
  const user = { ...req.body, id: randomUUID() };
  users.push(user);
  res.status(200).json({ created_user: user });
});

//update user
app.put(
  '/user/:id',
  validator.params(paramsIDSchema),
  validator.body(updateUserBodySchema),
  (req, res) => {
    const index = users.findIndex((user) => user.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ message: `no user with id ${req.params.id}` });
    } else {
      users[index] = { ...users[index], ...req.body };
      res.status(200).json({ updated_user: users[index] });
    }
  }
);

//delete user
app.delete('/user/:id', validator.params(paramsIDSchema), (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ message: `no user with id ${req.params.id}` });
  } else {
    users[index] = { ...users[index], isDeleted: true };
    res
      .status(200)
      .json({ message: `user with id ${req.params.id} marked as deleted` });
  }
});

// filter users on limit
app.get('/users', validator.query(paramsSubstringLimitSchema), (req, res) => {
  const substring = req.query.login_substring as string;
  const limit = req.query.limit;

  if (!users.length) {
    res.status(404).json({ message: `no users` });
  }

  let sortedUsers: User[] = [];
  const filteredUsers = substring
    ? users.filter((user) => user.login.includes(substring))
    : users;

  if (!filteredUsers.length) {
    res.status(404).json({ message: `no users mach the query: ${substring}` });
  } else {
    sortedUsers = filteredUsers.sort((a, b) => (a.login > b.login ? 1 : -1));
    const restrictedUsers = limit ? sortedUsers.splice(0, +limit) : sortedUsers;
    res.status(200).json({ users: restrictedUsers });
  }
});

app.listen(3000);
