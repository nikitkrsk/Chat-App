import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
  ManyToOne,
} from "typeorm";
import { Role, Status, AdminContactInfo } from ".";

@Entity()
@Unique(["email"])
@Unique(["uuid"])
export class Admin {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Role, (role) => role.admins)
  role: Role;

  @ManyToOne(() => Status, (status) => status.admins)
  status: Status;

  @OneToMany(() => AdminContactInfo, (info) => info.admin, { nullable: true })
  info?: Admin[];

  @Column({ nullable: true, default: false })
  loginStatus: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
