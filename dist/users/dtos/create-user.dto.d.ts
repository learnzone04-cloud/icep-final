import { UserRole } from '../entity/User';
export declare class CreateUserDto {
    fName: string;
    lName: string;
    phoneNumber: string;
    active: boolean;
    email: string;
    password: string;
    role: UserRole;
}
