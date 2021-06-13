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
import { Role, Status, Admin, Group, Message, Refresh} from ".";

@Entity()
@Unique(["email"])
@Unique(["uuid"])
export class ChatUser {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  loginStatus: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Status, (status) => status.admins)
  status: Status;

  @ManyToOne(() => Role, (role) => role.admins)
  role: Role;

  @OneToMany(() => ChatUser, (friend) => friend.friends, { nullable: true })
  friends?: ChatUser[];

  @OneToMany(() => Admin, (friend) => friend.userFriends, { nullable: true })
  adminFriends?: Admin[];

  @ManyToMany(() => Group, (group) => group.users, { nullable: true })
  groups?: Group[];

  @OneToMany(() => Message, (msg) => msg.users, {
    nullable: true,
  })
  messages?: Message[];

  @OneToMany(() => Refresh, (refresh) => refresh.admin, { nullable: true })
  refreshes?: Refresh[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
