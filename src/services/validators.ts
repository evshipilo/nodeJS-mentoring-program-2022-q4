import { createValidator } from 'express-joi-validation';
import {
    createUserBodySchema,
    paramsIDSchema,
    paramsSubstringLimitSchema,
    updateUserBodySchema,
  } from '../models/schemas';

const validator = createValidator();

export const createUserBodyValidation = validator.body(createUserBodySchema)





