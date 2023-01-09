import { Op } from 'sequelize';
import { Model } from 'sequelize/types/model';
import {sequelize, UserModel} from '../models/sequelizeORMModels'
import { User, UserUpdates } from '../types';

export async function createUser({login, password, age, is_deleted}: User) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      const user = await UserModel.create({ login, password, age, is_deleted });
      console.log(user?.toJSON());
      return user;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return error;
    }
  }

  export async function getUserById(id: string) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      const user: Model | null = await UserModel.findByPk(id);
      console.log(user?.toJSON());
      return user;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return error;
    }
  }

  export async function getUsers(
    limit: number | undefined,
    substring: string
  ) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      const users: Model[] = await UserModel.findAll({
        where: {
          login: {
            [Op.iLike]: `%${substring}%`
        }
        },
        limit,
        order: [['login', 'ASC']],
      });
      console.log(JSON.stringify(users, null, 2));
      return users;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return error;
    }
  }

  export async function updateUser(
    id: string,
    userUpdates: UserUpdates,
  ) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      const user: Model | null = await UserModel.findByPk(id);
      let updatedUser: Model | null = null;
      if (user) {
        user.set(userUpdates);
        updatedUser = await user.save();
      }
      return updatedUser;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return error;
    }
  }
  