export class DBInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DBInitializationError';
  }
}

export class FindUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FindUserError';
  }
}

export class FindGroupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FindGroupError';
  }
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export class JWTValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTValidationError';
  }
}

export class NoJWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoJWTError';
  }
}


