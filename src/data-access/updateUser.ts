import Model from 'sequelize/types/model';
import { sequelize, UserModel } from './dataBaseAccess';
import { UserUpdates } from '../models/types';

export default async function updateUser(id: string, userUpdates: UserUpdates) {
  try {
    const result = await sequelize.transaction(async () => {
      const user: Model | null = await UserModel.findByPk(id);
      let updatedUser: Model | null = null;
      if (user) {
        user.set(userUpdates);
        updatedUser = await user.save();
      }
      return updatedUser;
    });
    return result;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return error;
  }
}
