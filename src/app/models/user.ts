import { Role } from "./role";
export class User {
    maTK: number;
    username: string;
    password: string;
    hoTen: string;
    role: Role;
    token?: string;
}