import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany } from "typeorm";
import { Admin, ChatUser } from ".";

@Entity()
export class Status {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;


  @Column()
  name: string;

  @OneToMany(() => Admin, (admin) => admin.status, { nullable: true })
  admins?: Admin[];

  @OneToMany(() => ChatUser, (user) => user.status, { nullable: true })
  users?: ChatUser[];
}
