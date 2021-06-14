import {
  MigrationInterface,
  getRepository,
  QueryRunner,
  Repository,
} from "typeorm";
import { ChatUser, Role, Status } from "../entity";
import { default as AdminsSeed } from "./seed/Admin.json";
import { default as RolesSeed } from "./seed/Role.json";
import { default as StatusesSeed } from "./seed/Status.json";
import passwordHash from "password-hash";

export class Admins1618747590625 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const roleRepository: Repository<Role> = getRepository(Role);
    const statusRepository: Repository<Status> = getRepository(Status);

    // tslint:disable-next-line
    console.log("Creating Roles...");
    Promise.all(
      RolesSeed.map((el) => {
        let role: Role = new Role();
        role = el;
        return Promise.resolve(roleRepository.save(role));
      })
    ).then(() => {
      // tslint:disable-next-line
      console.log("Roles are created");
      // tslint:disable-next-line
      console.log("Creating Statuses...");
      Promise.all(
        StatusesSeed.map((el) => {
          let status: Status = new Status();
          status = el;
          return Promise.resolve(statusRepository.save(status));
        })
      ).then(() => {
        // tslint:disable-next-line
        console.log("Statuses are created");
        // tslint:disable-next-line
        console.log("Creating admins...");
        Promise.all(
          AdminsSeed.map(async (admin) => {
            let u = new ChatUser();
            const status: Status = await statusRepository.findOne({
              where: { name: "active" },
            });
            const role: Role = await roleRepository.findOne({
              where: { name: admin.role },
            });
            u = {
              ...admin,
              createdAt: new Date(),
              updatedAt: new Date(),
              verifiedAt: new Date(),
              status,
              role,
              image: null,
              password: passwordHash.generate(admin.password),
            };
            return Promise.resolve(userRepository.save(u));
          })
        ).then((adm) => {
          // tslint:disable-next-line
          console.log("admins are created");
        });
      });
    });
  }
  /* tslint:disable:no-empty */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
