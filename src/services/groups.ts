import {
  createQueryBuilder,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Group } from "../entity";
import { IResponse, IGetGroups } from "../interfaces";

export default class UserService {
  public static getAll = async (
    uuid: string
  ): Promise<IResponse<IGetGroups>> => {
    const groupRepository: Repository<Group> = getRepository(Group);

    // TODO Find a better solution
    const privateGroups: SelectQueryBuilder<Group> = groupRepository
      .createQueryBuilder("group")
      .innerJoinAndSelect("group.users", "users", "users.uuid = :uuid", {
        uuid,
      })
      .innerJoinAndSelect("group.users", "user")
      .where("group.private = :private", { private: true });

    const publicUserGroups: SelectQueryBuilder<Group> = groupRepository
      .createQueryBuilder("group")
      .innerJoinAndSelect("group.users", "users", "users.uuid = :uuid", {
        uuid,
      })
      .innerJoinAndSelect("group.users", "user")
      .where("group.private = :private", { private: false });

    const publicGroups: SelectQueryBuilder<Group> = groupRepository
      .createQueryBuilder("group")
      .innerJoinAndSelect("group.users", "users", "users.uuid != :uuid", {
        uuid,
      })
      .innerJoinAndSelect("group.users", "user")
      .where("group.private = :private", { private: false });

    // console.log(privateGroups.getQuery())

    const groupsPr = await privateGroups.getMany();
    const groupsPubUser = await publicUserGroups.getMany();
    const groupsPub = await publicGroups.getMany();

    if (groupsPr === undefined) {
      return { error: { code: 404, msg: "No Records" } };
    }
    return {
      result: {
        privateGroups: groupsPr,
        publicGroupsWithUser: groupsPubUser,
        publicGroups: groupsPub,
      },
    };
  };
}
