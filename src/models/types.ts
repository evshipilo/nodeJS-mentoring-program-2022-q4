export type User = {
  id?: string;
  login: string;
  password: string;
  age: number;
  is_deleted: boolean;
};

export type UserUpdates = {
  id?: string;
  login?: string;
  password?: string;
  age?: number;
  is_deleted?: boolean;
}
