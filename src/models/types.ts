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

export type Group = {
  id?: string;
  name: string;
  permissions: Array<Permission>;
};

export type GroupUpdates = {
  id?: string;
  name?: string;
  permissions?: Array<Permission>;
};

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES'
