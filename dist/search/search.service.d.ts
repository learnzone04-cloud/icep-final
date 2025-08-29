import { Repository } from 'typeorm';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Course } from '../course/entities/course.entity';
export declare class SearchService {
    private readonly teacherRepo;
    private readonly courseRepo;
    constructor(teacherRepo: Repository<TeacherEntity>, courseRepo: Repository<Course>);
    searchAll(name: string, user: any): Promise<{
        id: number;
        name: string;
        type: string;
    }[]>;
}
