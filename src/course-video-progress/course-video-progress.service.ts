import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseVideoProgress } from './entity/CourseVideoProgress.entity';
import { Student } from '../student/entity/Student';
import { Course } from '../course/entities/course.entity';
import { CourseVideoEntity } from '../course-video/entity/course-video.entity';

@Injectable()
export class CourseVideoProgressService {
  constructor(
    @InjectRepository(CourseVideoProgress)
    private readonly progressRepo: Repository<CourseVideoProgress>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(CourseVideoEntity)
    private readonly videoRepo: Repository<CourseVideoEntity>,
  ) {}

  async initializeProgress(userId: number, courseId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new Error('Student not found');
    
    const videos = await this.videoRepo.find({ where: { courseId }, order: { number: 'ASC' } });
    if (!videos.length) return;
    const progressRows = videos.map((video, idx) => this.progressRepo.create({
      studentId: student.id,
      courseId,
      videoId: video.id,
      videoNumber: video.number,
      isUnlocked: idx === 0,
      isWatched: false,
    }));
    await this.progressRepo.save(progressRows);
  }

  async unlockNext(userId: number, courseId: number, videoId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new Error('Student not found');
    
    const current = await this.progressRepo.findOne({ where: { studentId: student.id, courseId, videoId } });
    if (!current) return { message: 'Progress not found' };
    current.isWatched = true;
    await this.progressRepo.save(current);
    
    // Find the next video by videoNumber
    const next = await this.progressRepo.findOne({
      where: {
        studentId: student.id,
        courseId,
        videoNumber: current.videoNumber + 1,
      },
    });
    if (next) {
      next.isUnlocked = true;
      await this.progressRepo.save(next);
    }
    return { message: 'Next video unlocked (if any)' };
  }

  async getProgress(userId: number, courseId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new Error('Student not found');
    
    return this.progressRepo.find({ where: { studentId: student.id, courseId }, order: { videoNumber: 'ASC' } });
  }

  async lockAllExceptFirst(studentId: number, courseId: number) {
    const progresses = await this.progressRepo.find({ where: { studentId, courseId }, order: { videoNumber: 'ASC' } });
    if (!progresses.length) return;
    for (let i = 0; i < progresses.length; i++) {
      progresses[i].isUnlocked = i === 0;
    }
    await this.progressRepo.save(progresses);
  }
} 