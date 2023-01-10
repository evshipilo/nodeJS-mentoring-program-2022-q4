import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_group",
  })
  users: User[];
}

@Entity('user_group')
export class UserGroup {
  @PrimaryColumn({ type: 'uuid' })
  usersId: string;

  @PrimaryColumn({ type: 'uuid' })
  groupsId: string;

  @OneToOne(() => User)
  @JoinTable()
  user: User;

  @OneToOne(() => Group)
  @JoinTable()
  group: Group;
}
