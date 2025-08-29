import { Repository } from 'typeorm';
import { Lesson } from './entity/Lesson';
export declare class LessonSchedulerService {
    private lessonRepository;
    private readonly logger;
    constructor(lessonRepository: Repository<Lesson>);
    autoCompleteLessons(): Promise<void>;
}
