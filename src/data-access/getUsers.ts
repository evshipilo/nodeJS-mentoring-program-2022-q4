import { Op } from 'sequelize';
import Model from 'sequelize/types/model';
import { sequelize, UserModel } from './dataBaseAccess';
export default async function getUsers(
  limit: number | undefined,
  substring: string
) {
  try {
    const result = await sequelize.transaction(async () => {
      const users: Model[] = await UserModel.findAll({
        where: {
          login: {
            [Op.iLike]: `%${substring}%`,
          },
        },
        limit,
        order: [['login', 'ASC']],
      });
      console.log(JSON.stringify(users, null, 2));
      return users;
    });
    return result;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return error;
  }
}
