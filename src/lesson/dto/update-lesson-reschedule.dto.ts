import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonRescheduleDto } from './create-lesson-reschedule.dto';

export class UpdateLessonRescheduleDto extends PartialType(CreateLessonRescheduleDto) {} 