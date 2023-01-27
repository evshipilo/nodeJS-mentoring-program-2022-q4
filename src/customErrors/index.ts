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


