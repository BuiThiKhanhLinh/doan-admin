import { Role } from "./role";
export class User {
    id: number;
    username: string;
    password: string;
    hoten: string;
    role: Role;
    token?: string;
}