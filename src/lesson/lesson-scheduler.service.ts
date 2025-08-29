import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson, LessonStatus } from './entity/Lesson';

@Injectable()
export class LessonSchedulerService {
  private readonly logger = new Logger(LessonSchedulerService.name);

  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  // Runs every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async autoCompleteLessons() {
    const now = new Date();
    // Find all SCHEDULED lessons whose end time has passed
    const lessons = await this.lessonRepository.find({
      where: { status: LessonStatus.SCHEDULED },
    });
    for (const lesson of lessons) {
      const lessonEnd = new Date(lesson.lessonDate);
      const [endHour, endMinute] = lesson.endTime.split(':').map(Number);
      lessonEnd.setHours(endHour, endMinute, 0, 0);
      if (lessonEnd < now) {
        lesson.status = LessonStatus.COMPLETED;
        await this.lessonRepository.save(lesson);
        this.logger.log(`Lesson ${lesson.id} marked as COMPLETED.`);
      }
    }
  }
} 