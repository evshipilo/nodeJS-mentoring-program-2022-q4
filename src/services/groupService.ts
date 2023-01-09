import {
  createGroup,
  deleteGroup,
  getGroupById,
  getGroups,
  updateGroup,
} from '../data-access/typeORMDataAccess';
import { Group } from '../models/typeORMModels';
import { GroupUpdates } from '../types';

export class GroupService {
  public async createGroup(group: Group) {
    const result = await createGroup(group);
    return result;
  }

  public async getGroupById(id: string) {
    const result = await getGroupById(id);
    return result;
  }

  public async updateGroup(id: string, groupUpdates: GroupUpdates) {
    const result = await updateGroup(id, groupUpdates);
    return result;
  }

  public async deleteGroup(id: string) {
    const result = await deleteGroup(id);
    return result;
  }

  public async getGroups() {
    const result = await getGroups();
    return result;
  }
}
