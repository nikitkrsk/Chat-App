import {
  MigrationInterface,
  getRepository,
  QueryRunner,
  Repository,
} from "typeorm";
import { Admin, AdminContactInfo, Role, Status } from "../entity";
import { default as AdminsSeed } from "./seed/Admin.json";
import { default as RolesSeed } from "./seed/Role.json";
import { default as StatusesSeed } from "./seed/Status.json";
import passwordHash from "password-hash";

export class Admins1618747590625 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRepository: Repository<Admin> = getRepository(Admin);
    const adminContactInfoRepository: Repository<AdminContactInfo> = getRepository(
      AdminContactInfo
    );
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
            let u = new Admin();
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
              status,
              role,
              image: null,
              password: passwordHash.generate(admin.password),
            };
            return Promise.resolve(adminRepository.save(u));
          })
        ).then((adm) => {
          // tslint:disable-next-line
          console.log("admins are created");
          // tslint:disable-next-line
          console.log("Creating admin contact info...");
          Promise.all(
            AdminsSeed.map(async (info) => {
              Object.entries(info.contactInfo).forEach(([key, value]) => {
                let r = new AdminContactInfo();
                r = {
                  name: key,
                  value,
                  admin: adm.find((el: Admin) => el.email === info.email),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                Promise.resolve(adminContactInfoRepository.save(r));
              });
            })
          ).then(() => {
            // tslint:disable-next-line
            console.log("info is created");
          });
        });
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
