import request from 'supertest';
import createApplication from '../src/createApp';
import { FindGroupError } from '../src/customErrors';
import { User } from '../src/models/typeORMModels';

const mockUserService = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getUsers: jest.fn(),
  getUserByCredentials: jest.fn(),
};

const mockGroupService = {
  createGroup: jest.fn(),
  getGroupById: jest.fn(),
  updateGroup: jest.fn(),
  deleteGroup: jest.fn(),
  getGroups: jest.fn(),
  addUsersToGroup: jest.fn(),
};

const validCredentials = {
  login: 'log123',
  password: 'password1234',
};

const validUserData = {
  ...validCredentials,
  age: 30,
  is_deleted: false,
};

const validGroupName = 'grpup1';
const notValidGroupName = 'g';
const validGroupId = '44e042a2-2acd-466f-bdfc-ec1e7a671dsd';
const notValidGroupId = 'not valid ID';
const validGroupPermissions = [
  'READ',
  'WRITE',
  'DELETE',
  'SHARE',
  'UPLOAD_FILES',
];
const notValidGroupPermissions = [
  'READ1',
  'WRITE',
  'DELETE',
  'SHARE',
  'UPLOAD_FILES',
];
const notValidJWT = 'not valid string';
const validUserId = '44e042a2-2acd-466f-bdfc-ec1e7a671dsd';
const validUserIds = [
  '44e042a2-2acd-466f-bdfc-ec1e7a671dsd',
  '54e042a2-2acd-466f-bdfc-ec1e7a671dsd',
];
const notValidUserIds = [
  '44e042a2-2acd-466f-bdfc-ec1e7a671d',
  '54e042a2-2acd-466f-bdfc-ec1e7a671d',
];
const notValidLogin = 'a';
const notValidPassword = '1';
const notValidUserId = 'not valid ID';
const validSubstring = 'log';
const notValidSubstring = 'logaaaaaaaaaaa';
const validLimit = 3;
const notValidLimit = 'a';
const loginValidationErrorMessage =
  'Error validating request body. "login" length must be at least 3 characters long.';
const notValidCredentialsMessage = 'Bad Username/Password combination';
const notValidJWTMessage = 'Failed jwt token';
const noJWTMessage = 'No jwt token provided'
const notValidUserIDMessage = 'Error validating request params. "id" length must be at least 36 characters long.'
const notValidGroupIDMessage = 'Error validating request params. "id" length must be at least 36 characters long.'
const successfullDeleteMessage = `group with id ${validGroupId} deleted`
const noUserMessage  = 'no user'
const noGroupMessage  = 'no group'
const notValidLimitMessage  = 'Error validating request query. "limit" must be a number.'
const notValidSubstringMessage = 'Error validating request query. "loginsubstring" length must be less than or equal to 10 characters long.'
const notValidGroupNameMessage = 'Error validating request body. "name" length must be at least 3 characters long.'
const notValidUsersMessage = 'Error validating request body. "usersId[0]" length must be at least 36 characters long. "usersId[1]" length must be at least 36 characters long.'
const createdGroupRelationsName = 'grpup1'
const validGroupData = {
  name: validGroupName,
  permissions: validGroupPermissions,
};

async function getValidJWT() {
  const credentials = validCredentials;
  const user = new User();
  mockUserService.getUserByCredentials.mockReturnValue(user);
  const response = await request(application)
    .post('/user/login')
    .send(credentials);
  return response.body.token;
}

const application = createApplication(mockUserService, mockGroupService);

describe('CONTROLLER: ', () => {
  describe('User Controller: ', () => {
    describe('POST /user/login', () => {
      beforeEach(() => {
        mockUserService.getUserByCredentials.mockClear();
      });
      describe('when credentials passed validation', () => {
        test('should trigger getUserByCredentials method with credentials', async () => {
          const body = validCredentials;
          await request(application).post('/user/login').send(body);
          expect(mockUserService.getUserByCredentials).toBeCalledWith(
            body.login,
            body.password
          );
        });
      });
      describe('when credentials not valid', () => {
        test('should respond with 400', async () => {
          const body = {
            ...validCredentials,
            login: notValidLogin,
          };
          const response = await request(application)
            .post('/user/login')
            .send(body);
          expect(mockUserService.getUserByCredentials).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(loginValidationErrorMessage);
        });
      });
      describe('when user not found by credentials', () => {
        test('should respond with a 401 status code', async () => {
          const body = validCredentials;
          const user = {};
          mockUserService.getUserByCredentials.mockReturnValueOnce(user);
          const response = await request(application)
            .post('/user/login')
            .send(body);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidCredentialsMessage);
        });
      });
      describe('when user found by credentials', () => {
        const body = validCredentials;
        const user = new User();
        mockUserService.getUserByCredentials.mockReturnValue(user);
        test('should respond with a 200 status code', async () => {
          const response = await request(application)
            .post('/user/login')
            .send(body);
          expect(response.status).toBe(200);
        });
        test('should respond with a token', async () => {
          const response = await request(application)
            .post('/user/login')
            .send(body);
          expect(response.body.token.length).toBeGreaterThan(83);
          expect(typeof response.body.token).toBe('string');
        });
      });
    });

    describe('POST /user (create user)', () => {
      beforeEach(() => {
        mockUserService.createUser.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const body = validUserData;
          const response = await request(application)
            .post('/user')
            .set('jwt-access-token', notValidJWT)
            .send(body);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const body = validUserData;
          const response = await request(application).post('/user').send(body);
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when user data valid', () => {
        test('should trigger createUser method with user data', async () => {
          const body = validUserData;
          await request(application)
            .post('/user')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(mockUserService.createUser).toBeCalledWith(body);
        });
        test('should respond with new user', async () => {
          const body = validUserData;
          mockUserService.createUser.mockReturnValueOnce(body);
          const response = await request(application)
            .post('/user')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(response.body.createdUser).toEqual(body);
        });
        test('should respond with 200', async () => {
          const body = validUserData;
          const response = await request(application)
            .post('/user')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(response.status).toBe(200);
        });
      });
      describe('when user data not valid', () => {
        test('should respond with 400', async () => {
          const body = {
            ...validUserData,
            login: notValidLogin,
          };
          const response = await request(application)
            .post('/user')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(mockUserService.createUser).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(loginValidationErrorMessage)
        });
      });
    });

    describe('GET /user/:id (get user by id)', () => {
      beforeEach(() => {
        mockUserService.getUserById.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .get(`/user/${validUserId}`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).get(
            `/user/${validUserId}`
          );
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when user id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .get(`/user/${notValidUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUserById).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidUserIDMessage)
        });
      });
      describe('when user not found', () => {
        test('should respond with 404', async () => {
          mockUserService.getUserById.mockImplementationOnce(() => {
            throw new FindGroupError('no user');
          });
          const response = await request(application)
            .get(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUserById).toBeCalledWith(validUserId);
          expect(response.status).toBe(404);
          expect(response.text).toBe(noUserMessage)
        });
      });
      describe('when user found', () => {
        test('should respond with 200', async () => {
          mockUserService.getUserById.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .get(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUserById).toBeCalledWith(validUserId);
          expect(response.status).toBe(200);
        });
        test('should respond with user data', async () => {
          mockUserService.getUserById.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .get(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUserById).toBeCalledWith(validUserId);
          expect(response.body.user).toEqual(validUserData);
        });
      });
    });

    describe('PUT /user/:id (update user)', () => {
      beforeEach(() => {
        mockUserService.updateUser.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .put(`/user/${validUserId}`)
            .set('jwt-access-token', notValidJWT)
            .send(validUserData);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application)
            .put(`/user/${validUserId}`)
            .send(validUserData);
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when user id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .put(`/user/${notValidUserId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validUserData);
          expect(mockUserService.updateUser).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidUserIDMessage)
        });
      });
      describe('when user update data not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .put(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT())
            .send({ ...validUserData, login: notValidLogin });
          expect(mockUserService.updateUser).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(loginValidationErrorMessage)
        });
      });
      describe('when user not found', () => {
        test('should respond with 404', async () => {
          mockUserService.updateUser.mockImplementationOnce(() => {
            throw new FindGroupError('no user');
          });
          const response = await request(application)
            .put(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validUserData);
          expect(mockUserService.updateUser).toBeCalledWith(
            validUserId,
            validUserData
          );
          expect(response.status).toBe(404);
          expect(response.text).toBe(noUserMessage)
        });
      });
      describe('when user found', () => {
        test('should respond with 200', async () => {
          mockUserService.updateUser.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .put(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validUserData);
          expect(mockUserService.updateUser).toBeCalledWith(
            validUserId,
            validUserData
          );
          expect(response.status).toBe(200);
        });
        test('should respond with user data', async () => {
          mockUserService.updateUser.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .put(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validUserData);
          expect(mockUserService.updateUser).toBeCalledWith(
            validUserId,
            validUserData
          );
          expect(response.body.updatedUser).toEqual(validUserData);
        });
      });
    });

    describe('DELETE /user/:id (delete user)', () => {
      beforeEach(() => {
        mockUserService.deleteUser.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .delete(`/user/${validUserId}`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).delete(
            `/user/${validUserId}`
          );
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when user id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .delete(`/user/${notValidUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.deleteUser).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidUserIDMessage)
        });
      });
      describe('when user not found', () => {
        test('should respond with 404', async () => {
          mockUserService.deleteUser.mockImplementationOnce(() => {
            throw new FindGroupError('no user');
          });
          const response = await request(application)
            .delete(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.deleteUser).toBeCalledWith(validUserId);
          expect(response.status).toBe(404);
          expect(response.text).toBe(noUserMessage)
        });
      });
      describe('when user found', () => {
        test('should respond with 200', async () => {
          mockUserService.deleteUser.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .delete(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.deleteUser).toBeCalledWith(validUserId);
          expect(response.status).toBe(200);
        });
        test('should respond with message', async () => {
          mockUserService.deleteUser.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .delete(`/user/${validUserId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.deleteUser).toBeCalledWith(validUserId);
          expect(response.body.message).toEqual(
            `user with id ${validUserId} marked as deleted`
          );
        });
      });
    });

    describe('GET /users (get users)', () => {
      beforeEach(() => {
        mockUserService.getUsers.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .get(`/users`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).get(`/users`);
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when limit param not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .get(`/users?limit=${notValidLimit}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUsers).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidLimitMessage)
        });
      });
      describe('when loginsubstring param not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .get(`/users?loginsubstring=${notValidSubstring}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUsers).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidSubstringMessage)
        });
      });
      describe('when request valid', () => {
        test('should respond with 200', async () => {
          mockUserService.getUsers.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .get(`/users?limit=${validLimit}&loginsubstring=${validSubstring}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUsers).toBeCalledWith(
            validSubstring,
            validLimit
          );
          expect(response.status).toBe(200);
        });
        test('should respond with data', async () => {
          mockUserService.getUsers.mockReturnValueOnce(validUserData);
          const response = await request(application)
            .get(`/users?limit=${validLimit}&loginsubstring=${validSubstring}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockUserService.getUsers).toBeCalledWith(
            validSubstring,
            validLimit
          );
          expect(response.body.users).toEqual(validUserData);
        });
      });
    });
  });

  describe('Group Controller: ', () => {
    describe('POST /group (create group)', () => {
      beforeEach(() => {
        mockGroupService.createGroup.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const body = validGroupData;
          const response = await request(application)
            .post('/group')
            .set('jwt-access-token', notValidJWT)
            .send(body);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const body = validGroupData;
          const response = await request(application).post('/group').send(body);
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when group data valid', () => {
        test('should trigger createGroup method with group data', async () => {
          const body = validGroupData;
          await request(application)
            .post('/group')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(mockGroupService.createGroup).toBeCalledWith(body);
        });
        test('should respond with new group', async () => {
          const body = validGroupData;
          mockGroupService.createGroup.mockReturnValueOnce(body);
          const response = await request(application)
            .post('/group')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(response.body.createdGroup).toEqual(body);
        });
        test('should respond with 200', async () => {
          const body = validGroupData;
          const response = await request(application)
            .post('/group')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(response.status).toBe(200);
        });
      });
      describe('when group data not valid', () => {
        test('should respond with 400', async () => {
          const body = {
            ...validGroupData,
            name: notValidGroupName,
          };
          const response = await request(application)
            .post('/group')
            .set('jwt-access-token', await getValidJWT())
            .send(body);
          expect(mockGroupService.createGroup).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidGroupNameMessage)
        });
      });
    });

    describe('GET /group/:id (get group by id)', () => {
      beforeEach(() => {
        mockGroupService.getGroupById.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .get(`/group/${validGroupId}`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).get(
            `/group/${validGroupId}`
          );
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when group id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .get(`/group/${notValidGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroupById).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidGroupIDMessage)
        });
      });
      describe('when group not found', () => {
        test('should respond with 404', async () => {
          mockGroupService.getGroupById.mockImplementationOnce(() => {
            throw new FindGroupError('no group');
          });
          const response = await request(application)
            .get(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroupById).toBeCalledWith(validGroupId);
          expect(response.status).toBe(404);
          expect(response.text).toBe(noGroupMessage)
        });
      });
      describe('when group found', () => {
        test('should respond with 200', async () => {
          mockGroupService.getGroupById.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .get(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroupById).toBeCalledWith(validGroupId);
          expect(response.status).toBe(200);
        });
        test('should respond with group data', async () => {
          mockGroupService.getGroupById.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .get(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroupById).toBeCalledWith(validGroupId);
          expect(response.body.group).toEqual(validGroupData);
        });
      });
    });

    describe('GET /groups (get groups)', () => {
      beforeEach(() => {
        mockGroupService.getGroups.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .get(`/groups`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).get(`/groups`);
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when groups found', () => {
        test('should respond with 200', async () => {
          mockGroupService.getGroups.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .get(`/groups`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroups).toBeCalledWith();
          expect(response.status).toBe(200);
        });
        test('should respond with data', async () => {
          mockGroupService.getGroups.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .get(`/groups`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroups).toBeCalledWith();
          expect(response.body.groups).toEqual(validGroupData);
        });
      });
      describe('when groups not found', () => {
        test('should respond with 404', async () => {
          mockGroupService.getGroups.mockImplementationOnce(() => {
            throw new FindGroupError('no group');
          });
          const response = await request(application)
            .get(`/groups`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.getGroups).toBeCalledWith();
          expect(response.status).toBe(404);
          expect(response.text).toBe(noGroupMessage)
        });
      });
    });

    describe('PUT /group/:id (update group)', () => {
      beforeEach(() => {
        mockGroupService.updateGroup.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .put(`/group/${validGroupId}`)
            .set('jwt-access-token', notValidJWT)
            .send(validGroupData);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application)
            .put(`/group/${validGroupId}`)
            .send(validGroupData);
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when group id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .put(`/group/${notValidGroupId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validGroupData);
          expect(mockGroupService.updateGroup).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidGroupIDMessage)
        });
      });
      describe('when group update data not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .put(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT())
            .send({ ...validGroupData, name: notValidGroupName });
          expect(mockGroupService.updateGroup).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidGroupNameMessage)
        });
      });
      describe('when group not found', () => {
        test('should respond with 404', async () => {
          mockGroupService.updateGroup.mockImplementationOnce(() => {
            throw new FindGroupError('no group');
          });
          const response = await request(application)
            .put(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validGroupData);
          expect(mockGroupService.updateGroup).toBeCalledWith(
            validGroupId,
            validGroupData
          );
          expect(response.status).toBe(404);
          expect(response.text).toBe(noGroupMessage)
        });
      });
      describe('when group found', () => {
        test('should respond with 200', async () => {
          mockGroupService.updateGroup.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .put(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validGroupData);
          expect(mockGroupService.updateGroup).toBeCalledWith(
            validGroupId,
            validGroupData
          );
          expect(response.status).toBe(200);
        });
        test('should respond with group data', async () => {
          mockGroupService.updateGroup.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .put(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT())
            .send(validGroupData);
          expect(mockGroupService.updateGroup).toBeCalledWith(
            validGroupId,
            validGroupData
          );
          expect(response.body.updatedGroup).toEqual(validGroupData);
        });
      });
    });

    describe('DELETE /group/:id (delete group)', () => {
      beforeEach(() => {
        mockGroupService.deleteGroup.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .delete(`/group/${validGroupId}`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).delete(
            `/group/${validGroupId}`
          );
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when group id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .delete(`/group/${notValidGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.deleteGroup).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidGroupIDMessage)
        });
      });
      describe('when group not found', () => {
        test('should respond with 404', async () => {
          mockGroupService.deleteGroup.mockImplementationOnce(() => {
            throw new FindGroupError('no group');
          });
          const response = await request(application)
            .delete(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.deleteGroup).toBeCalledWith(validGroupId);
          expect(response.status).toBe(404);
          expect(response.text).toBe(noGroupMessage)
        });
      });
      describe('when group found', () => {
        test('should respond with 200', async () => {
          mockGroupService.deleteGroup.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .delete(`/group/${validGroupId}`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.deleteGroup).toBeCalledWith(validGroupId);
          expect(response.status).toBe(200);
          expect(response.body.message).toBe(successfullDeleteMessage)
        });
      });
    });

    describe('POST /group/:id/addusers add users to group)', () => {
      beforeEach(() => {
        mockGroupService.addUsersToGroup.mockClear();
      });
      describe('when jwt not valid', () => {
        test('should respond with 401', async () => {
          const response = await request(application)
            .post(`/group/${validGroupId}/addusers`)
            .set('jwt-access-token', notValidJWT);
          expect(response.status).toBe(401);
          expect(response.text).toBe(notValidJWTMessage)
        });
      });
      describe('when no jwt', () => {
        test('should respond with 403 ', async () => {
          const response = await request(application).post(
            `/group/${validGroupId}/addusers`
          );
          expect(response.status).toBe(403);
          expect(response.text).toBe(noJWTMessage)
        });
      });
      describe('when group id not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .post(`/group/${notValidGroupId}/addusers`)
            .set('jwt-access-token', await getValidJWT());
          expect(mockGroupService.addUsersToGroup).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidGroupIDMessage)
        });
      });
      describe('when user ids not valid', () => {
        test('should respond with 400', async () => {
          const response = await request(application)
            .post(`/group/${validGroupId}/addusers`)
            .set('jwt-access-token', await getValidJWT())
            .send({ usersId: notValidUserIds });
          expect(mockGroupService.addUsersToGroup).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.text).toBe(notValidUsersMessage)
        });
      });
      describe('when request valid', () => {
        test('should respond with 200', async () => {
          mockGroupService.addUsersToGroup.mockReturnValueOnce(validGroupData);
          const response = await request(application)
            .post(`/group/${validGroupId}/addusers`)
            .set('jwt-access-token', await getValidJWT())
            .send({ usersId: validUserIds });
          expect(mockGroupService.addUsersToGroup).toBeCalledWith(
            validGroupId,
            validUserIds
          );
          expect(response.status).toBe(200);
          expect(response.body.createdGroupRelations.name).toBe(createdGroupRelationsName)
        });
      });
    });
  });
});
