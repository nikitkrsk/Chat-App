import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany } from "typeorm";
import { ChatUser } from ".";

@Entity()
export class Status {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;


  @Column()
  name: string;

  @OneToMany(() => ChatUser, (user) => user.status, { nullable: true })
  users?: ChatUser[];
}
