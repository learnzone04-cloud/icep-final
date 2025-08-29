import { Repository } from 'typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { Rate } from './entities/rate.entity';
import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
export declare class RateService {
    private readonly rateRepository;
    private readonly studentRepository;
    private readonly teacherRepository;
    constructor(rateRepository: Repository<Rate>, studentRepository: Repository<Student>, teacherRepository: Repository<TeacherEntity>);
    create(createRateDto: CreateRateDto, studentId: number): Promise<Rate>;
    findAll(): Promise<Rate[]>;
    findOne(id: number): Promise<Rate>;
    findByTeacherId(teacherId: number): Promise<Rate[]>;
    update(id: number, updateRateDto: UpdateRateDto, studentId: number): Promise<Rate>;
    remove(id: number, studentId: number): Promise<{
        message: string;
    }>;
    getAverageRatingByTeacherId(teacherId: number): Promise<number | null>;
}
