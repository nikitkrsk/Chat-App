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
import { Role, Status, Group, Message, Session } from ".";

@Entity()
@Unique(["email"])
@Unique(["username"])
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
  verified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Status, (status) => status.users)
  status: Status;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => ChatUser, (friend) => friend.friends, { nullable: true })
  friends?: ChatUser[];

  @OneToMany(() => Session, (session) => session.user, { nullable: true })
  sessions?: Session[];

  @ManyToMany(() => Group, (group) => group.users, { nullable: true })
  groups?: Group[];

  @OneToMany(() => Message, (msg) => msg.users, {
    nullable: true,
  })
  messages?: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
