import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatUser } from ".";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  jti: string;

  @Column()
  ip: string;

  @Column()
  browser: string;

  @Column({ default: false })
  loginStatus: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ChatUser, (user) => user.sessions)
  user: ChatUser;
}
