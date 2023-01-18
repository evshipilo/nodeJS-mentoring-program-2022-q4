import { Group, User } from '../models/typeORMModels';
import { GroupUpdates, UserUpdates } from '../types';
import AppDataSource from './dbConfig';

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
    console.error('Database error:', error);
    throw error;
  }
}

export async function getUsers(substring?: string, limit?: number) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const results = substring
          ? await transactionalEntityManager
              .getRepository(User)
              .createQueryBuilder('user')
              .where('user.login like :login', { login: `%${substring}%` })
              .orderBy('user.login', 'ASC')
              .limit(limit)
              .getMany()
          : await transactionalEntityManager
              .getRepository(User)
              .createQueryBuilder('user')
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
    console.error('Database error:', error);
    throw error;
  }
}

export async function createGroup(newGroup: Group) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const group = transactionalEntityManager
          .getRepository(Group)
          .create(newGroup);
        const results = await transactionalEntityManager
          .getRepository(Group)
          .save(group);
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getGroupById(id: string) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const results = await transactionalEntityManager
          .getRepository(Group)
          .findOneBy({
            id,
          });
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getGroups() {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const results = await transactionalEntityManager
          .getRepository(Group)
          .createQueryBuilder('group')
          .orderBy('group.name', 'ASC')
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

export async function updateGroup(id: string, groupUpdates: GroupUpdates) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        let results = await transactionalEntityManager
          .getRepository(Group)
          .findOneBy({
            id,
          });
        if (results) {
          await transactionalEntityManager
            .getRepository(Group)
            .merge(results, groupUpdates);
          results = await transactionalEntityManager
            .getRepository(Group)
            .save(results);
        }
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function deleteGroup(id: string) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const results = await transactionalEntityManager
          .getRepository(Group)
          .findOneBy({
            id,
          });
        if (results) {
          await transactionalEntityManager.getRepository(Group).remove(results);
        }
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function addUsersToGroup(groupId: string, userIds: string[]) {
  try {
    const res = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        let results;
        const arrOfPromises = userIds.map(async (id) => {
          const user: User | null = await transactionalEntityManager
            .getRepository(User)
            .findOneBy({
              id,
            });

          return user;
        });
        const users: Array<User | null> = await Promise.all(arrOfPromises);
        const filteredUsers = users.filter((user) => !!user) as User[];

        const group: Group | null = await transactionalEntityManager
          .getRepository(Group)
          .findOneBy({
            id: groupId,
          });
        if (group) {
          const mergeResult = transactionalEntityManager
            .getRepository(Group)
            .merge(group, { users: filteredUsers });
          results = await transactionalEntityManager
            .getRepository(Group)
            .save(mergeResult);
        }
        return results;
      }
    );
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
