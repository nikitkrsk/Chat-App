import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToMany,
} from "typeorm";
import { Admin } from ".";

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid?: string;

  @Column()
  name: string;

  @OneToMany(() => Admin, (admin) => admin.status, { nullable: true })
  admins?: Admin[];
}
