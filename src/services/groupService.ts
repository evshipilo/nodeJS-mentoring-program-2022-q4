import createGroup from '../data-access/createGroup';
import { Group } from '../models/types';

export class GroupService {
  public async createGroup(group: Group) {
    const result = await createGroup(group);
    return result;
  }

//   public async getUserById(id: string) {
//     const result = await getUserById(id);
//     return result;
//   }

//   public async updateUser(id: string, userUpdates: UserUpdates) {
//     const result = await updateUser(id, userUpdates);
//     return result;
//   }

//   public async deleteUser(
//     id: string,
//     userUpdates: UserUpdates = { is_deleted: true }
//   ) {
//     const result = await updateUser(id, userUpdates);
//     return result;
//   }

//   public async getUsers(
//     limit: string | undefined,
//     substring: string | undefined
//   ) {
//     const updatedLimit = limit ? +limit : undefined;
//     const updatedSubstring = substring ? substring : '';
//     const result = await getUsers(updatedLimit, updatedSubstring);
//     return result;
//   }
}
