import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from '../users/users.service';
import { promisify } from 'util';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { TypesService } from 'src/types/types.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private typesService: TypesService,
    private studentService: StudentService,
    private teacherService: TeacherService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(data: any) {
    const user = await this.userService.findOne(data.email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    if (!user.active) {
      throw new NotFoundException('User Can not Sing in');
    }

    // Require typeId for students
    let typeId = data.typeId;
    let typeName = undefined;
    let studentId = undefined;
    let teacherId = undefined;
    if (user.role === 'Student') {
      if (!typeId) {
        throw new BadRequestException('typeId is required for students');
      }
      // Add type to student-type if not present
      await this.studentService.addTypeIfNotExists(user.id, typeId);
      const type = await this.typesService.findOneById(typeId);
      typeName = type?.name;
      // Get studentId
      const student = await this.studentService.findOneByUserId(user.id);
      studentId = student?.id;
    } else if (user.role === 'Teacher') {
      // Get teacherId
      const teacher = await this.teacherService.findOneByUser(user.id);
      teacherId = teacher?.id;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...returnData } = user;
    const payload: any = {
      name: `${user.fName}  ${user.lName}`,
      id: user.id,
      role: user.role,
    };
    if (typeId && typeName) {
      payload.typeId = typeId;
      payload.typeName = typeName;
    }
    if (studentId) {
      payload.studentId = studentId;
    }
    if (teacherId) {
      payload.teacherId = teacherId;
    }

    return {
      ...returnData,
      accessToken: this.jwtService.sign(payload),
      studentId: studentId,
      teacherId: teacherId,
    };
  }

  async register(data: CreateUserDto & { typeId?: number }) {
    if (data.role === 'Teacher') {
      data.active = false;
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    data.password = result;
    const user = await this.userService.createUser(data);
    // If student, create student record (but do not add studentId to JWT yet)
    if (user.role === 'Student') {
      await this.studentService.createStudentForUser(user.id);
    }
    let typeId = data.typeId;
    let typeName = undefined;
    if (user.role === 'Student' && typeId) {
      // Add type to student-type if not present
      await this.studentService.addTypeIfNotExists(user.id, typeId);
      const type = await this.typesService.findOneById(typeId);
      typeName = type?.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...returnData } = user;
    const payload: any = {
      name: `${user.fName}  ${user.lName}`,
      id: user.id,
      role: user.role,
    };
    if (typeId && typeName) {
      payload.typeId = typeId;
      payload.typeName = typeName;
    }
    // Do NOT add studentId or teacherId here
    return {
      ...returnData,
      accessToken: this.jwtService.sign(payload),
    };
  }

  getProfile(id: number) {
    return this.userService.findOneById(id);
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.password) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(data.password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      data.password = result;
    }
    return await this.userService.update(id, data);
  }

  async delete(id: number) {
    return await this.userService.delete(id);
  }
}