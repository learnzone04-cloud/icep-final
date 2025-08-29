import { UserEntity, UserRole } from './entity/User';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { CertificateEntity } from '../certificate/entities/certificate.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
export declare class UsersService {
    private userRepo;
    private teacherRepo;
    private certificateRepo;
    constructor(userRepo: Repository<UserEntity>, teacherRepo: Repository<TeacherEntity>, certificateRepo: Repository<CertificateEntity>);
    createUser(data: CreateUserDto): Promise<UserEntity>;
    find(): Promise<UserEntity[]>;
    findOne(email: any): Promise<UserEntity>;
    findTeacherRequest(): Promise<UserEntity[]>;
    findPendingTeacherRequests(): Promise<{
        id: number;
        name: string;
        email: string;
        teacherCreatedAt: Date;
        phoneNumber: string;
    }[]>;
    findApprovedTeachers(): Promise<{
        id: number;
        name: string;
        email: string;
        teacherCreatedAt: Date;
        phoneNumber: string;
    }[]>;
    findAllStudentsOrderedByType(): Promise<{
        studentsByType: {
            [key: string]: any[];
        };
        multipleTypeStudents: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            studentCreatedAt: Date;
            types: {
                typeId: number;
                typeName: string;
            }[];
        }[];
    }>;
    findTeacherById(userId: number): Promise<{
        id: number;
        fName: string;
        lName: string;
        phoneNumber: string;
        active: boolean;
        email: string;
        password: string;
        role: UserRole;
        createdAt: Date;
        teacher: {
            id: number;
            facebookUrl: string;
            instagramUrl: string;
            coverLetter: string;
            cv: string;
            userId: number;
            typeId: number;
            createdAt: Date;
            certificate: any[] | CertificateEntity;
        };
    }>;
    findOneById(id: number): Promise<UserEntity>;
    delete(id: number): Promise<UserEntity>;
    update(id: number, data: UpdateUserDto): Promise<UserEntity>;
    deleteTeacherRecord(teacherId: number): Promise<TeacherEntity>;
}
