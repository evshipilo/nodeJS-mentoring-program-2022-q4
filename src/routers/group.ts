import express, { Response } from 'express';
import { GroupService } from '../services/groupService';
import {
  groupBodyValidatorOnCreate,
  groupBodyValidatorOnUpdate,
  groupRelationsBodyValidator,
  paramsIdValidator,
} from '../validation/validators';
import { Group } from '../models/typeORMModels';
import { ValidatedRequest } from 'express-joi-validation';
import {
  CreateGroupBodySchema,
  CreateGroupRelationsBodySchema,
  ParamsIDSchema,
  UpdateUserBodySchema,
} from '../validation/types';

const group = express.Router();
const groupService = new GroupService();

group.post(
  '/group',
  groupBodyValidatorOnCreate,
  async (req: ValidatedRequest<CreateGroupBodySchema>, res: Response) => {
    const group: Group = { ...req.body };
    const result = await groupService.createGroup(group);
    if (result instanceof Error) {
      res.status(500).json({ message: result });
    } else {
      res.status(200).json({ createdGroup: result });
    }
  }
);

group.get(
  '/group/:id',
  paramsIdValidator,
  async (req: ValidatedRequest<ParamsIDSchema>, res: Response) => {
    const { id } = req.params;
    const result = await groupService.getGroupById(id);
    if (result instanceof Error) {
      res.status(500).json({ message: result });
    } else {
      result
        ? res.status(200).json({ group: result })
        : res.status(404).json({ message: `no groups with id ${id}` });
    }
  }
);

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
  async (
    req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
    res: Response
  ) => {
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

group.delete(
  '/group/:id',
  paramsIdValidator,
  async (req: ValidatedRequest<ParamsIDSchema>, res: Response) => {
    const { id } = req.params;
    const result = await groupService.deleteGroup(id);
    if (result instanceof Error) {
      res.status(500).json({ message: result });
    } else {
      result
        ? res.status(200).json({ message: `group with id ${id} deleted` })
        : res.status(404).json({ message: `no groups with id ${id}` });
    }
  }
);

group.post(
  '/group/:id/add_users',
  paramsIdValidator,
  groupRelationsBodyValidator,
  async (req: ValidatedRequest<ParamsIDSchema & CreateGroupRelationsBodySchema>, res: Response) => {
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
