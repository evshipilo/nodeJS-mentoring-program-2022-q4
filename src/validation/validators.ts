import { createValidator } from 'express-joi-validation';
import {
  createGroupBodySchema,
    createUserBodySchema,
    paramsIDSchema,
    paramsSubstringLimitSchema,
    updateGroupBodySchema,
    updateUserBodySchema,
  } from './schemas';

const validator = createValidator();

export const userBodyValidatorOnCreate = validator.body(createUserBodySchema);
export const userBodyValidatorOnUpdate = validator.body(updateUserBodySchema);
export const paramsIdValidator = validator.params(paramsIDSchema)
export const userQuerySubstringLimitValidator = validator.query(paramsSubstringLimitSchema)
export const groupBodyValidatorOnCreate = validator.body(createGroupBodySchema)
export const groupBodyValidatorOnUpdate = validator.body(updateGroupBodySchema)





