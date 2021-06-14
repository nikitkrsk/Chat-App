import {
  Entity,
  Column,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChatUser } from ".";

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;


  @Column()
  name: string;

  @OneToMany(() => ChatUser, (user) => user.role, { nullable: true })
  users?: ChatUser[];
}
