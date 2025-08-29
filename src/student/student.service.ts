import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dtos/create-student.dto';
import { Student } from './entity/Student';
import { StudentType } from 'src/student-type/entity/StudentType';
import { TypeEntity } from 'src/types/entity/Type';
import { TypesService } from 'src/types/types.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private repo: Repository<Student>,
    private readonly userService: UsersService,
    @InjectRepository(StudentType)
    private studentTypeRepo: Repository<StudentType>,
    @InjectRepository(TypeEntity)
    private typeRepo: Repository<TypeEntity>,
    private readonly typesService: TypesService,
  ) {}

  async createTeacher(id: number, data: CreateStudentDto) {
    const user = await this.userService.findOneById(id);
    const teacher = this.repo.create(data);
    teacher.user = user;
    return this.repo.save(teacher);
  }

  find() {
    return this.repo.find();
  }

  findOneByUserId(id: number) {
    return this.repo.findOne({
      where: { userId: id },
      relations: ['user'],
    });
  }

  findOneById(id: number) {
    return this.repo.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async delete(id: number) {
    const findTeacher = await this.findOneById(id);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');

    return this.repo.remove(findTeacher);
  }

  async update(id: number, data: CreateStudentDto) {
    const findTeacher = await this.findOneById(id);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');
    Object.assign(findTeacher, data);
    return this.repo.save(findTeacher);
  }

  async createStudentForUser(userId: number) {
    const student = this.repo.create({ userId });
    return this.repo.save(student);
  }

  async updateProfile(userId: number, data: Partial<CreateStudentDto>) {
    const student = await this.findOneByUserId(userId);
    if (!student) throw new NotFoundException('Student not found');
    Object.assign(student, data);
    return this.repo.save(student);
  }

  async addTypeIfNotExists(userId: number, typeId: number) {
    // Find the student by userId
    const student = await this.findOneByUserId(userId);
    if (!student) throw new NotFoundException('Student not found');
    // Check if the type already exists for this student
    let studentType = await this.studentTypeRepo.findOne({ where: { studentId: student.id, typeId } });
    if (!studentType) {
      // Create new StudentType
      studentType = this.studentTypeRepo.create({ studentId: student.id, typeId });
      await this.studentTypeRepo.save(studentType);
    }
    return studentType;
  }

  async getStudentIdByUserId(userId: number): Promise<number> {
    const student = await this.findOneByUserId(userId);
    if (!student) {
      throw new NotFoundException('Student not found for this user');
    }
    return student.id;
  }
}
