import { sequelize, GroupModel } from './dataBaseAccess';
import { Group } from '../models/types';

export default async function createUser({ name, permissions }: Group) {
  try {
    const result = await sequelize.transaction(async () => {
      const group = await GroupModel.create({
        name,
        permissions,
      });
      console.log(group?.toJSON());
      return group;
    });
    return result;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return error;
  }
}
