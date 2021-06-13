import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

import { ChatUser, Admin } from ".";

@Entity()
@Unique(["refreshToken"])
export class Refresh {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @Column()
  email: string;

  @ManyToOne(() => ChatUser, (user) => user.refreshes, { nullable: true })
  user: ChatUser;

  @ManyToOne(() => Admin, (user) => user.refreshes, { nullable: true })
  admin: Admin;
}
