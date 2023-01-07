import { sequelize, UserModel} from './dataBaseAccess';
import { User } from '../models/types';

export default async function createUser({
  login,
  password,
  age,
  is_deleted,
}: User) {
  try {
    const result = await sequelize.transaction(async () => {
      const user = await UserModel.create({
        login,
        password,
        age,
        is_deleted,
      });
      console.log(user?.toJSON());
      return user;
    });
    return result;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return error;
  }
}
