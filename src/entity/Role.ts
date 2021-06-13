import {
  Entity,
  Column,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin, ChatUser } from ".";

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;


  @Column()
  name: string;

  @OneToMany(() => Admin, (admin) => admin.role, { nullable: true })
  admins?: Admin[];

  @OneToMany(() => ChatUser, (user) => user.role, { nullable: true })
  users?: ChatUser[];
}
