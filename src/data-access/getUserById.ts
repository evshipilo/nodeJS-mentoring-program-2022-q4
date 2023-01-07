import Model from 'sequelize/types/model';
import { sequelize, UserModel} from './dataBaseAccess';
export default async function getUserById(id: string) {
  try {
    const result = await sequelize.transaction(async () => {
      const user: Model | null = await UserModel.findByPk(id);
      console.log(user?.toJSON());
      return user;
    });
    return result;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return error;
  }
}
