import {
  DBInitializationError,
  FindGroupError,
  FindUserError,
} from '../customErrors';
import { logger } from '../logger/winstonLogger';
import { Group, User } from '../models/typeORMModels';
import { GroupUpdates, UserUpdates } from '../types';
import AppDataSource from './dbConfig';

AppDataSource.initialize()
  .then(() => {
    logger.info('Data base initialized');
  })
  .catch((e) => {
    throw new DBInitializationError('initialize faled');
  });

export async function createUser(newUser: User) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      const user = transactionalEntityManager
        .getRepository(Group)
        .create(newUser);
      const results = await transactionalEntityManager
        .getRepository(User)
        .save(user);
      return results;
    }
  );
  return result;
}

export async function getUserById(id: string) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      const results = await transactionalEntityManager
        .getRepository(User)
        .findOneBy({
          id,
        });
      if (!results) throw new FindUserError(`no user with id: ${id}`);
      return results;
    }
  );
  return result;
}

export async function getUsers(substring?: string, limit?: number) {
  const result = await AppDataSource.transaction(
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
  return result;
}

export async function updateUser(id: string, userUpdates: UserUpdates) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      let results = await transactionalEntityManager
        .getRepository(User)
        .findOneBy({
          id,
        });
      if (!results) throw new FindUserError(`no user with id: ${id}`);
      transactionalEntityManager
        .getRepository(User)
        .merge(results, userUpdates);
      results = await transactionalEntityManager
        .getRepository(User)
        .save(results);
      return results;
    }
  );
  return result;
}

export async function createGroup(newGroup: Group) {
  const result = await AppDataSource.transaction(
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
  return result;
}

export async function getGroupById(id: string) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      const results = await transactionalEntityManager
        .getRepository(Group)
        .findOneBy({
          id,
        });
      if (!results) throw new FindGroupError(`no group with id: ${id}`);
      return results;
    }
  );
  return result;
}

export async function getGroups() {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      const results = await transactionalEntityManager
        .getRepository(Group)
        .createQueryBuilder('group')
        .orderBy('group.name', 'ASC')
        .getMany();
      return results;
    }
  );
  return result;
}

export async function updateGroup(id: string, groupUpdates: GroupUpdates) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      let results = await transactionalEntityManager
        .getRepository(Group)
        .findOneBy({
          id,
        });
      if (!results) throw new FindGroupError(`no group with id: ${id}`);
      transactionalEntityManager
        .getRepository(Group)
        .merge(results, groupUpdates);
      results = await transactionalEntityManager
        .getRepository(Group)
        .save(results);
      return results;
    }
  );
  return result;
}

export async function deleteGroup(id: string) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      const results = await transactionalEntityManager
        .getRepository(Group)
        .findOneBy({
          id,
        });
      if (!results) throw new FindGroupError(`no group with id: ${id}`);
      await transactionalEntityManager.getRepository(Group).remove(results);
      return results;
    }
  );
  return result;
}

export async function addUsersToGroup(groupId: string, userIds: string[]) {
  const result = await AppDataSource.transaction(
    async (transactionalEntityManager) => {
      // let results;
      // const arrOfPromises = userIds.map(async (id) => {
      //   const user: User | null = await transactionalEntityManager
      //     .getRepository(User)
      //     .findOneBy({
      //       id,
      //     });

      //   return user;
      // });
      // const users: Array<User | null> = await Promise.all(arrOfPromises);
      // const filteredUsers = users.filter((user) => !!user) as User[];

      // const group: Group | null = await transactionalEntityManager
      //   .getRepository(Group)
      //   .findOneBy({
      //     id: groupId,
      //   });
      // if (group) {
      //   const mergeResult = transactionalEntityManager
      //     .getRepository(Group)
      //     .merge(group, { users: filteredUsers });
      //   results = await transactionalEntityManager
      //     .getRepository(Group)
      //     .save(mergeResult);
      // }
      const results = await transactionalEntityManager
        .createQueryBuilder()
        .relation(Group, 'users')
        .of(groupId)
        .add(userIds);
      return results;
    }
  );
  return result;
}
