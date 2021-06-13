import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Admin } from ".";

@Entity()
export class AdminContactInfo {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Admin, (admin) => admin.info)
  admin: Admin;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
