import {
  getRepository,
  Repository,
} from "typeorm";
import { Admin, AdminContactInfo, Role, Status } from "../entity";
import { IResponse } from "../interfaces";
import passwordHash from "password-hash";
import { AdminCreate, AdminUpdate } from "../interfaces/admin";

export default class AdminService {
  public static getAllAdmins = async (): Promise<IResponse<Admin[]>> => {
    const adminRepository: Repository<Admin> = getRepository(Admin);

    const admins = await adminRepository.find({
      order: {
        createdAt: "DESC",
      },
      join: {
        alias: "admin",
        leftJoinAndSelect: {
          role: "admin.role",
          status: "admin.status",
          info: "admin.info",
        },
      },
    });

    if (admins === undefined) {
      return { error: { code: 404, msg: "No Records" } };
    }
    if (admins.length === 0) {
      return { error: { code: 204, msg: "No Records" } };
    }
    return {
      result: admins,
    };
  };

  public static createAdmin = async (
    input: AdminCreate
  ): Promise<IResponse<Admin>> => {
    const adminRepository: Repository<Admin> = getRepository(Admin);
    const statusRepository: Repository<Status> = getRepository(Status);
    const roleRepository: Repository<Role> = getRepository(Role);
    const adminContactInfoRepository: Repository<AdminContactInfo> = getRepository(
      AdminContactInfo
    );

    const checkAdminExist: Admin = await adminRepository.findOne({
      where: { email: input.email },
    });

    if (checkAdminExist !== undefined) {
      return {
        error: { code: 409, msg: "User with this email already exists" },
      };
    }

    const status = await statusRepository.findOne({
      where: { name: "active" },
    });

    const role: Role = await roleRepository.findOne({
      where: { name: input.role },
    });
    if (role === undefined) {
      return {
        error: { code: 409, msg: "Incorrect Role" },
      };
    }

    let admin: Admin = new Admin();
    admin = {
      ...admin,
      ...input,
      status,
      role,
      password: passwordHash.generate(input.password),
    };

    try {
      await adminRepository.save(admin);
    } catch (e) {
      return {
        error: { code: 500, msg: "Something went wrong" },
      };
    }
    if (input.contactInfo !== undefined) {
      Object.entries(input.contactInfo).forEach(async ([key, value]) => {
        let contactInfo = new AdminContactInfo();
        contactInfo = {
          name: key,
          value,
          admin,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        try {
          await adminContactInfoRepository.save(contactInfo);
        } catch (e) {
          return {
            error: { code: 500, msg: "Something went wrong" },
          };
        }
      });
    }

    delete admin.password;
    return { result: admin };
  };

  public static updateAdmin = async (
    input: AdminUpdate,
    uuid: string
  ): Promise<IResponse<Admin>> => {
    const adminRepository: Repository<Admin> = getRepository(Admin);
    const statusRepository: Repository<Status> = getRepository(Status);
    const roleRepository: Repository<Role> = getRepository(Role);
    const adminContactInfoRepository: Repository<AdminContactInfo> = getRepository(
      AdminContactInfo
    );

    let admin: Admin = await adminRepository.findOne({
      where: { uuid },
    });

    if (admin === undefined) {
      return {
        error: { code: 404, msg: "User with such id doesn't exists" },
      };
    }

    const status =
      (await statusRepository.findOne({
        where: { name: input.status },
      })) ?? admin.status;

    const role: Role =
      (await roleRepository.findOne({
        where: { name: input.role },
      })) ?? admin.role;

    const password: string = input.password ?? admin.password
    admin = {
      ...admin,
      ...input,
      status,
      role,
      password: admin.password,
    };

    try {
      await adminRepository.save(admin);
    } catch (e) {
      return {
        error: { code: 500, msg: "Something went wrong" },
      };
    }

    delete admin.password;
    return { result: admin };
  };
}
