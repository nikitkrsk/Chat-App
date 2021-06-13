import {
  Entity,
  Column,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Admin, ChatUser, Message } from ".";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  private: string;

  @Column()
  lastActive: Date;

  @ManyToMany(() => Admin, (admin) => admin.groups, { nullable: true })
  admins?: Admin[];

  @ManyToMany(() => ChatUser, (user) => user.groups, { nullable: true })
  users?: ChatUser[];

  @OneToMany(() => Message, (msg) => msg.group, { nullable: true })
  messages?: Message[];
}