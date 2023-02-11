import * as Repository from '../data-access/typeORMDataAccess';
import { User } from '../models/typeORMModels';
import { UserUpdates } from '../types';

export class UserService {
  public async createUser(user: User) {
    return await Repository.createUser(user);
  }

  public async getUserById(id: string) {
    return await Repository.getUserById(id);
  }

  public async updateUser(id: string, userUpdates: UserUpdates) {
    return await Repository.updateUser(id, userUpdates);
  }

  public async deleteUser(
    id: string,
    userUpdates: UserUpdates = { is_deleted: true }
  ) {
    return await Repository.updateUser(id, userUpdates);
  }

  public async getUsers(substring?: string, limit?: number) {
    return await Repository.getUsers(substring, limit);
  }

  public async getUserByCredentials(login: string, password: string) {
    return await Repository.getUserByCredentials(login, password);
  }
}
