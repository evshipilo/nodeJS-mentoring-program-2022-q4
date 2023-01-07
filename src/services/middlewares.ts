import { createValidator } from 'express-joi-validation';
import {
    createUserBodySchema,
    paramsIDSchema,
    paramsSubstringLimitSchema,
    updateUserBodySchema,
    createGroupBodySchema
  } from '../models/schemas';

const validator = createValidator();

export const createUserBodyValidation = validator.body(createUserBodySchema);
export const updateUserBodyValidation = validator.body(updateUserBodySchema);
export const paramsIdValidation = validator.params(paramsIDSchema);
export const querySubstringLimitValidation = validator.query(paramsSubstringLimitSchema);

export const createGroupBodyValidation = validator.body(createGroupBodySchema);





