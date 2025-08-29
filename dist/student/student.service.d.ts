import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dtos/create-student.dto';
import { Student } from './entity/Student';
import { StudentType } from 'src/student-type/entity/StudentType';
import { TypeEntity } from 'src/types/entity/Type';
import { TypesService } from 'src/types/types.service';
export declare class StudentService {
    private repo;
    private readonly userService;
    private studentTypeRepo;
    private typeRepo;
    private readonly typesService;
    constructor(repo: Repository<Student>, userService: UsersService, studentTypeRepo: Repository<StudentType>, typeRepo: Repository<TypeEntity>, typesService: TypesService);
    createTeacher(id: number, data: CreateStudentDto): Promise<Student>;
    find(): Promise<Student[]>;
    findOneByUserId(id: number): Promise<Student>;
    findOneById(id: number): Promise<Student>;
    delete(id: number): Promise<Student>;
    update(id: number, data: CreateStudentDto): Promise<Student>;
    createStudentForUser(userId: number): Promise<Student>;
    updateProfile(userId: number, data: Partial<CreateStudentDto>): Promise<Student>;
    addTypeIfNotExists(userId: number, typeId: number): Promise<StudentType>;
    getStudentIdByUserId(userId: number): Promise<number>;
}
