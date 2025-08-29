import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { Rate } from './entities/rate.entity';
import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

  async create(createRateDto: CreateRateDto, studentId: number) {
    // Check if student exists
    const student = await this.studentRepository.findOne({ where: { userId: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if teacher exists
    const teacher = await this.teacherRepository.findOne({ where: { id: createRateDto.teacherId } });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Check if student already rated this teacher
    const existingRate = await this.rateRepository.findOne({
      where: { studentId: student.id, teacherId: createRateDto.teacherId }
    });

    if (existingRate) {
      throw new ForbiddenException('You have already rated this teacher');
    }

    const rate = this.rateRepository.create({
      ...createRateDto,
      studentId : student.id,
    });

    return this.rateRepository.save(rate);
  }

  async findAll() {
    return this.rateRepository.find({
      relations: ['student', 'teacher', 'student.user', 'teacher.user']
    });
  }

  async findOne(id: number) {
    const rate = await this.rateRepository.findOne({
      where: { id },
      relations: ['student', 'teacher', 'student.user', 'teacher.user']
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }
    return rate;
  }

  async findByTeacherId(teacherId: number) {
    return this.rateRepository.find({
      where: { teacherId },
      relations: ['student', 'student.user']
    });
  }

  async update(id: number, updateRateDto: UpdateRateDto, studentId: number) {
    const rate = await this.findOne(id);
    
    if (rate.studentId !== studentId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    Object.assign(rate, updateRateDto);
    return this.rateRepository.save(rate);
  }

  async remove(id: number, studentId: number) {
    const rate = await this.findOne(id);
    
    if (rate.studentId !== studentId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }

    await this.rateRepository.remove(rate);
    return { message: 'Rating deleted successfully' };
  }

  async getAverageRatingByTeacherId(teacherId: number): Promise<number | null> {
    const result = await this.rateRepository
      .createQueryBuilder('rate')
      .select('AVG(rate.rating)', 'avg')
      .where('rate.teacherId = :teacherId', { teacherId })
      .getRawOne();
    return result && result.avg !== null ? parseFloat(result.avg) : null;
  }
}
