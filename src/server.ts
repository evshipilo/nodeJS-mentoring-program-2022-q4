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
app.use(express.json());

// // get all users
// app.get('/users', (req, res) => {
//   res.json(users);
// });

// get user by ID
app.get('/user/:id', validator.params(paramsIDSchema), (req, res) => {
  const filteredUsers = users.filter((user) => user.id === req.params.id);
  if (filteredUsers.length) {
    res.json(filteredUsers);
  } else {
    res.json(`no user with id ${req.params.id}`);
  }
});

// create user
app.post('/user', validator.body(createUserBodySchema), (req, res) => {
  const user = { ...req.body, id: randomUUID() };
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
    if (index === -1) {
      res.json(`no user with id ${req.params.id}`);
    } else {
      users[index] = { ...users[index], ...req.body };
      res.json(users[index]);
    }
  }
);

//delete user
app.delete('/user/:id', validator.params(paramsIDSchema), (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  if (index === -1) {
    res.json(`no user with id ${req.params.id}`);
  } else {
    users[index] = { ...users[index], isDeleted: true };
    res.json(`user with id ${req.params.id} marked as deleted`);
  }
});

// filter users on limit
app.get('/users', validator.query(paramsSubstringLimitSchema), (req, res) => {
  const substring = req.query.login_substring as string;
  const limit = req.query.limit;

  let sortedUsers: User[] = [];
  const filteredUsers = substring
    ? users.filter((user) => user.login.includes(substring))
    : users;

  if (!filteredUsers.length) {
    res.json(`no users mach the query: ${substring}`);
  } else {
    sortedUsers = filteredUsers.sort((a, b) => (a.login > b.login ? 1 : -1));
    const restrictedUsers = limit ? sortedUsers.splice(0, +limit) : sortedUsers;
    res.json(restrictedUsers);
  }
});

app.listen(3000);
