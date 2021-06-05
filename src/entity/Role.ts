import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToMany,
} from "typeorm";
import { Admin } from ".";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid?: string;

  @Column()
  name: string;

  @OneToMany(() => Admin, (admin) => admin.role, { nullable: true })
  admins?: Admin[];
}
