import express from 'express';
import { connection } from '../data-access/postgresql';
import { createUserBodyValidation } from '../services/validators';
const user = express.Router();

user.post('/user', createUserBodyValidation, (req, res) => {
  const user = { ...req.body, id: '111111' };
  connection();
  res.json(user);
});

export default user;
