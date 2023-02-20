import * as Repository from '../data-access/typeORMDataAccess';
import { Group } from '../models/typeORMModels';
import { GroupUpdates } from '../types';

export default class GroupService {
  public async createGroup(group: Group) {
    const result = await Repository.createGroup(group);
    return result;
  }

  public async getGroupById(id: string) {
    const result = await Repository.getGroupById(id);
    return result;
  }

  public async updateGroup(id: string, groupUpdates: GroupUpdates) {
    const result = await Repository.updateGroup(id, groupUpdates);
    return result;
  }

  public async deleteGroup(id: string) {
    const result = await Repository.deleteGroup(id);
    return result;
  }

  public async getGroups() {
    const result = await Repository.getGroups();
    return result;
  }

  public async addUsersToGroup(groupId: string, userIds: string[]) {
    const result = await Repository.addUsersToGroup(groupId, userIds);
    return result;
  }
}
