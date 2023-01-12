import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from '../data-access/typeORMDataAccess';
import { User } from '../models/typeORMModels';
import { UserUpdates } from '../types';

export class UserService {
  public async createUser(user: User) {
    return await createUser(user);
  }

  public async getUserById(id: string) {
    return await getUserById(id);
  }

  public async updateUser(id: string, userUpdates: UserUpdates) {
    return await updateUser(id, userUpdates);
  }

  public async deleteUser(
    id: string,
    userUpdates: UserUpdates = { is_deleted: true }
  ) {
    return await updateUser(id, userUpdates);
  }

  public async getUsers(substring?: string, limit?: string) {
    const updatedLimit = limit ? +limit : undefined;
    const updatedSubstring = substring || '';
    return await getUsers(updatedSubstring, updatedLimit);
  }
}
