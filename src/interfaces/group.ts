
import {Group } from "../entity";

export interface IGetGroups {
    publicGroupsWithUser: Group[]
    privateGroups: Group[]
    publicGroups: Group[]
}