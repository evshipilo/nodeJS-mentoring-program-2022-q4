import { createValidator } from 'express-joi-validation';
import {
    createUserBodySchema,
    paramsIDSchema,
    paramsSubstringLimitSchema,
    updateUserBodySchema,
  } from './schemas';

const validator = createValidator();

export const userBodyValidatorOnCreate = validator.body(createUserBodySchema);
export const userBodyValidatorOnUpdate = validator.body(updateUserBodySchema);
export const userParamsIdValidator = validator.params(paramsIDSchema)
export const userQuerySubstringLimitValidator = validator.query(paramsSubstringLimitSchema)





