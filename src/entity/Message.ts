import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { ChatUser } from ".";
import { Group } from "./Group";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  context: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ChatUser, (user) => user.messages, { nullable: true })
  users?: ChatUser[];

  @ManyToOne(() => Group, (group) => group.messages, { nullable: true })
  group?: Group;
}
