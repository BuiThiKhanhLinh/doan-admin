import { Role } from "./role";
export class User {
    maTK: number;
    username: string;
    password: string;
    hoTen: string;
    phanQuyen: Role;
    token?: string;
}