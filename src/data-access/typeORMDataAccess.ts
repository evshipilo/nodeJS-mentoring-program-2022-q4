import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../models/typeORMModels';
import { UserUpdates } from '../types';

dotenv.config();

const username = process.env.DB_USERNAME || '';
const DBname = process.env.NAME || '';
const DBpassword = process.env.DB_PASSWORD || '';
const DBhost = process.env.DB_HOST;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DBhost,
  port: 5432,
  username,
  password: DBpassword,
  database: DBname,
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit();
  });

export async function createUser(newUser: User) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager
          .getRepository(User)
          .create(newUser);
        const results = await transactionalEntityManager
          .getRepository(User)
          .save(user);
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const results = await transactionalEntityManager
          .getRepository(User)
          .findOneBy({
            id,
          });
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export async function getUsers( substring: string, limit?: number) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const results = await transactionalEntityManager
          .getRepository(User)
          .createQueryBuilder('user')
          .where('user.login like :login', { login: `%${substring}%` })
          .orderBy('user.login', 'ASC')
          .limit(limit)
          .getMany();
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function updateUser(id: string, userUpdates: UserUpdates) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        let results = await transactionalEntityManager
          .getRepository(User)
          .findOneBy({
            id,
          });
        if (results) {
          await transactionalEntityManager
            .getRepository(User)
            .merge(results, userUpdates);
          results = await transactionalEntityManager
            .getRepository(User)
            .save(results);
        }
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}
