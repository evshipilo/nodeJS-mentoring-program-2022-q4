import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false, type: 'text' })
  login: string;

  @Column({ nullable: false, type: 'text' })
  password: string;

  @Column({ nullable: false, type: 'int' })
  age: number;

  @Column({ nullable: false, type: 'boolean' })
  is_deleted: boolean;
}

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column('text', { array: true })
  permissions: Permission[];
}
