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
    const result = await createUser(user);
    return result;
  }

  public async getUserById(id: string) {
    const result = await getUserById(id);
    return result;
  }

  public async updateUser(id: string, userUpdates: UserUpdates) {
    const result = await updateUser(id, userUpdates);
    return result;
  }

  public async deleteUser(
    id: string,
    userUpdates: UserUpdates = { is_deleted: true }
  ) {
    const result = await updateUser(id, userUpdates);
    return result;
  }

  public async getUsers(
    limit: string | undefined,
    substring: string | undefined
  ) {
    const updatedLimit = limit ? +limit : undefined;
    const updatedSubstring = substring ? substring : '';
    const result = await getUsers(updatedSubstring, updatedLimit,);
    return result;
  }
}
