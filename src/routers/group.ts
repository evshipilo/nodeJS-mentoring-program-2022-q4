import express, { NextFunction, Request, Response } from 'express';
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
import { methodLogger } from '../middlewares/methodLogger';

const group = express.Router();
const groupService = new GroupService();

group.post(
  '/group',
  groupBodyValidatorOnCreate,
  methodLogger,
  async (
    req: ValidatedRequest<CreateGroupBodySchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const group: Group = { ...req.body };
      const result = await groupService.createGroup(group);
      res.status(200).json({ createdGroup: result });
    } catch (e) {
      next(e);
    }
  }
);

group.get(
  '/group/:id',
  paramsIdValidator,
  methodLogger,
  async (
    req: ValidatedRequest<ParamsIDSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await groupService.getGroupById(id);
      res.status(200).json({ group: result });
    } catch (e) {
      next(e);
    }
  }
);

group.get(
  '/groups',
  methodLogger,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await groupService.getGroups();
      res.status(200).json({ groups: result });
    } catch (e) {
      next(e);
    }
  }
);

group.put(
  '/group/:id',
  groupBodyValidatorOnUpdate,
  paramsIdValidator,
  methodLogger,
  async (
    req: ValidatedRequest<ParamsIDSchema & UpdateUserBodySchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await groupService.updateGroup(id, req.body);
      res.status(200).json({ updatedGroup: result });
    } catch (e) {
      next(e);
    }
  }
);

group.delete(
  '/group/:id',
  paramsIdValidator,
  methodLogger,
  async (
    req: ValidatedRequest<ParamsIDSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      groupService.deleteGroup(id);
      res.status(200).json({ message: `group with id ${id} deleted` });
    } catch (e) {
      next(e);
    }
  }
);

group.post(
  '/group/:id/addusers',
  paramsIdValidator,
  groupRelationsBodyValidator,
  methodLogger,
  async (
    req: ValidatedRequest<ParamsIDSchema & CreateGroupRelationsBodySchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userIds: string[] = [...req.body.usersId];
      const result = await groupService.addUsersToGroup(id, userIds);
      res.status(200).json({ createdGroupRelations: result });
    } catch (e) {
      next(e);
    }
  }
);

export default group;
