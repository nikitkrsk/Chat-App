import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Role, Status, AdminContactInfo, ChatUser, Group, Message } from ".";

@Entity()
@Unique(["email"])
@Unique(["username"])
@Unique(["uuid"])
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  loginStatus: boolean;

  @ManyToOne(() => Status, (status) => status.admins)
  status: Status;

  @ManyToOne(() => Role, (role) => role.admins)
  role: Role;

  @OneToMany(() => AdminContactInfo, (info) => info.admin, { nullable: true })
  info?: Admin[];

  @OneToMany(() => Admin, (friend) => friend.friends, { nullable: true })
  friends?: Admin[];

  @OneToMany(() => ChatUser, (friend) => friend.adminFriends, {
    nullable: true,
  })
  userFriends?: Admin[];

  @ManyToMany(() => Group, (group) => group.admins, { nullable: true })
  groups?: Group[];

  @OneToMany(() => Message, (msg) => msg.admins, {
    nullable: true,
  })
  messages?: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
