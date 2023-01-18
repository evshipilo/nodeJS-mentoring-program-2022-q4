import express from 'express';
import { GroupService } from '../services/groupService';
import {
  groupBodyValidatorOnCreate,
  groupBodyValidatorOnUpdate,
  groupRelationsBodyValidator,
  paramsIdValidator,
} from '../validation/validators';
import { Group } from '../models/typeORMModels';

const group = express.Router();
const groupService = new GroupService();

group.post('/group', groupBodyValidatorOnCreate, async (req, res) => {
  const group: Group = { ...req.body };
  const result = await groupService.createGroup(group);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    res.status(200).json({ createdGroup: result });
  }
});

group.get('/group/:id', paramsIdValidator, async (req, res) => {
  const { id } = req.params;
  const result = await groupService.getGroupById(id);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    result
      ? res.status(200).json({ group: result })
      : res.status(404).json({ message: `no groups with id ${id}` });
  }
});

group.get('/groups', async (req, res) => {
  const result = await groupService.getGroups();

  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    res.status(200).json({ groups: result });
  }
});

group.put(
  '/group/:id',
  groupBodyValidatorOnUpdate,
  paramsIdValidator,
  async (req, res) => {
    const { id } = req.params;
    const result = await groupService.updateGroup(id, req.body);
    if (result instanceof Error) {
      res.status(500).json({ message: result });
    } else {
      result
        ? res.status(200).json({ updatedGroup: result })
        : res.status(404).json({ message: `no groups with id ${id}` });
    }
  }
);

group.delete('/group/:id', paramsIdValidator, async (req, res) => {
  const { id } = req.params;
  const result = await groupService.deleteGroup(id);
  if (result instanceof Error) {
    res.status(500).json({ message: result });
  } else {
    result
      ? res.status(200).json({ message: `group with id ${id} deleted` })
      : res.status(404).json({ message: `no groups with id ${id}` });
  }
});

group.post(
    '/group/:id/add_users',
    paramsIdValidator,
    groupRelationsBodyValidator,
    async (req, res) => {
      const { id } = req.params;
      const userIds: string[] = [...req.body.usersId];
      const result = await groupService.addUsersToGroup(id, userIds);
      if (result instanceof Error) {
        res.status(500).json({ message: result });
      } else {
        res.status(200).json({ createdGroupRelations: result });
      }
    }
  );

export default group;
