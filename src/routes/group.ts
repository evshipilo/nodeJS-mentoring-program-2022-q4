import express from 'express';
import { GroupService } from '../services/groupService';
import { createGroupBodyValidation } from '../services/middlewares';
import { Group } from '../models/types';

const group = express.Router();
const groupService = new GroupService();

group.post('/group', createGroupBodyValidation, async (req, res) => {
  const group: Group = { ...req.body };
  const result = await groupService.createGroup(group);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    res.status(200).json({ createdUser: result });
  }
});

export default group;
