import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Lesson, LessonStatus } from './entity/Lesson';
import { LessonReschedule, RescheduleStatus, RescheduleRequestedBy } from './entity/LessonReschedule';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonRescheduleDto } from './dto/create-lesson-reschedule.dto';
import { CreateLessonBatchDto, SingleLessonDto } from './dto/create-lesson-batch.dto';
import { GoogleCalendarService } from '../google-calendar.service';
import { AdminAuthService } from '../admin-auth/admin-auth.service';
import { UserEntity } from '../users/entity/User';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonReschedule)
    private rescheduleRepository: Repository<LessonReschedule>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private googleCalendarService: GoogleCalendarService,
    private adminAuthService: AdminAuthService,
  ) {}

  // Book a lesson
  async bookLesson(createDto: CreateLessonDto): Promise<Lesson> {
    // Validate the time slot is available
    await this.validateTimeSlotAvailability(createDto);

    // Calculate end time (1 hour after start time)
    const endTime = this.calculateEndTime(createDto.startTime);

    // Generate Google Meet link
    const meetLink = await this.generateGoogleMeetLink(createDto);

    const lesson = this.lessonRepository.create({
      ...createDto,
      endTime,
      meetLink,
      status: LessonStatus.SCHEDULED,
    });

    const savedLesson = await this.lessonRepository.save(lesson);

    // Send email notifications (to be implemented)
    await this.sendLessonConfirmationEmails(savedLesson);

    return savedLesson;
  }

  // Get all lessons for a teacher
  async getTeacherLessons(teacherId: number): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { teacherId },
      relations: ['student', 'reschedules'],
      order: { lessonDate: 'ASC', startTime: 'ASC' },
    });
  }

  // Get all lessons for a student
  async getStudentLessons(studentId: number): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { studentId },
      relations: ['teacher', 'reschedules'],
      order: { lessonDate: 'ASC', startTime: 'ASC' },
    });
  }

  // Request lesson reschedule
  async requestReschedule(createRescheduleDto: CreateLessonRescheduleDto): Promise<LessonReschedule> {
    // Verify the lesson exists
    const lesson = await this.lessonRepository.findOne({
      where: { id: createRescheduleDto.lessonId }
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Validate the new time slot is available
    await this.validateTimeSlotAvailability({
      teacherId: lesson.teacherId,
      studentId: lesson.studentId,
      lessonDate: createRescheduleDto.newDate,
      startTime: createRescheduleDto.newStartTime,
    });

    const reschedule = this.rescheduleRepository.create({
      ...createRescheduleDto,
      status: RescheduleStatus.PENDING,
    });

    return await this.rescheduleRepository.save(reschedule);
  }

  // Approve reschedule request
  async approveReschedule(rescheduleId: number): Promise<Lesson> {
    const reschedule = await this.rescheduleRepository.findOne({
      where: { id: rescheduleId },
      relations: ['lesson'],
    });

    if (!reschedule) {
      throw new NotFoundException('Reschedule request not found');
    }

    if (reschedule.status !== RescheduleStatus.PENDING) {
      throw new BadRequestException('Reschedule request is not pending');
    }

    // Update the lesson
    const lesson = reschedule.lesson;
    lesson.lessonDate = new Date(reschedule.newDate);
    lesson.startTime = reschedule.newStartTime;
    lesson.endTime = this.calculateEndTime(reschedule.newStartTime);
    lesson.status = LessonStatus.RESCHEDULED;

    // Update reschedule status
    reschedule.status = RescheduleStatus.APPROVED;

    await this.rescheduleRepository.save(reschedule);
    const updatedLesson = await this.lessonRepository.save(lesson);

    // Send email notifications (to be implemented)
    await this.sendRescheduleConfirmationEmails(updatedLesson, reschedule);

    return updatedLesson;
  }

  // Reject reschedule request
  async rejectReschedule(rescheduleId: number, reason?: string): Promise<LessonReschedule> {
    const reschedule = await this.rescheduleRepository.findOne({
      where: { id: rescheduleId }
    });

    if (!reschedule) {
      throw new NotFoundException('Reschedule request not found');
    }

    reschedule.status = RescheduleStatus.REJECTED;
    if (reason) {
      reschedule.reason = reason;
    }

    return await this.rescheduleRepository.save(reschedule);
  }

  // Complete a lesson
  async completeLesson(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId }
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    lesson.status = LessonStatus.COMPLETED;
    return await this.lessonRepository.save(lesson);
  }

  // Cancel a lesson
  async cancelLesson(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId }
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    lesson.status = LessonStatus.CANCELLED;
    return await this.lessonRepository.save(lesson);
  }

  // Get available time slots for a teacher on a specific date
  async getAvailableTimeSlots(teacherId: number, date: string): Promise<string[]> {
    const lessonDate = new Date(date);
    const dayOfWeek = lessonDate.getDay() === 0 ? 7 : lessonDate.getDay(); // Convert Sunday=0 to Sunday=7

    // Get teacher's availability for this day
    // const availabilities = await this.teacherAvailabilityService.getTeacherAllAvailability(teacherId);
    // const dayAvailability = availabilities.find(av => av.dayOfWeek === dayOfWeek);

    // if (!dayAvailability || !dayAvailability.isAvailable) {
    //   return [];
    // }

    // Generate time slots (1 hour lessons + 15 min breaks)
    const timeSlots = this.generateTimeSlots('09:00', '18:00');

    // Get booked lessons for this date
    const bookedLessons = await this.lessonRepository.find({
      where: { 
        teacherId, 
        lessonDate: new Date(date),
        status: LessonStatus.SCHEDULED
      }
    });

    console.log('Booked lessons for date:', date, bookedLessons);
    console.log('Available slots before filtering:', timeSlots);

    // Filter out booked slots
    const bookedTimes = bookedLessons.map(lesson => lesson.startTime);
    const availableSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));
    
    console.log('Booked times:', bookedTimes);
    console.log('Available slots after filtering:', availableSlots);
    
    return availableSlots;
  }

  async createLessonsBatch(dto: CreateLessonBatchDto) {
    const { teacherId, studentId, chatId, lessons, price } = dto;
    const createdLessons = [];
    // Fetch teacher and student emails
    const teacher = await this.userRepository.findOne({ where: { id: teacherId } });
    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!teacher || !student) {
      throw new NotFoundException('Teacher or student not found');
    }
    // Get admin tokens (assume first allowed admin email)
    const adminEmail = this.adminAuthService['ALLOWED_ADMIN_EMAILS'][0];
    const adminTokens = this.adminAuthService.getYouTubeTokens(adminEmail);
    if (adminTokens) {
      this.googleCalendarService.setCredentials({
        access_token: adminTokens.accessToken,
        refresh_token: adminTokens.refreshToken,
        scope: adminTokens.scope || 'https://www.googleapis.com/auth/calendar'
      });
    }
    for (const l of lessons) {
      // Check for overlap on the same date
      const existingLessons = await this.lessonRepository.find({
        where: {
          teacherId,
          lessonDate: new Date(l.lessonDate),
          status: Not(LessonStatus.CANCELLED),
        },
      });
      for (const existing of existingLessons) {
        if (
          (l.startTime < existing.endTime) &&
          (existing.startTime < l.endTime)
        ) {
          throw new BadRequestException(
            `Lesson overlaps with existing lesson from ${existing.startTime} to ${existing.endTime} on ${l.lessonDate}`
          );
        }
      }
      // Generate Google Meet link
      let meetLink = '';
      try {
        const summary = `Lesson-${student.fName} ${student.lName}-${teacher.fName} ${teacher.lName}`;
        meetLink = await this.googleCalendarService.createMeetEvent({
          summary,
          description: 'Private lesson between teacher and student',
          start: `${l.lessonDate}T${l.startTime}:00`,
          end: `${l.lessonDate}T${l.endTime}:00`,
          attendees: [teacher.email, student.email],
          timeZone: 'Asia/Damascus',
        });
      } catch (e) {
        // Optionally: log error, continue, or throw
        meetLink = '';
      }
      const lesson = this.lessonRepository.create({
        teacherId,
        studentId,
        chatId,
        lessonDate: new Date(l.lessonDate),
        startTime: l.startTime,
        endTime: l.endTime,
        price,
        status: LessonStatus.SCHEDULED,
        meetLink,
      });
      createdLessons.push(await this.lessonRepository.save(lesson));
    }
    return createdLessons;
  }

  async getLessonsByTeacher(teacherId: number) {
    const scheduled = await this.lessonRepository.find({ where: { teacherId, status: LessonStatus.SCHEDULED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    const cancelled = await this.lessonRepository.find({ where: { teacherId, status: LessonStatus.CANCELLED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    const completed = await this.lessonRepository.find({ where: { teacherId, status: LessonStatus.COMPLETED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    return { scheduled, cancelled, completed };
  }

  async getLessonsByStudent(studentId: number) {
    const scheduled = await this.lessonRepository.find({ where: { studentId, status: LessonStatus.SCHEDULED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    const cancelled = await this.lessonRepository.find({ where: { studentId, status: LessonStatus.CANCELLED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    const completed = await this.lessonRepository.find({ where: { studentId, status: LessonStatus.COMPLETED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    return { scheduled, cancelled, completed };
  }

  async getLessonsByChat(chatId: number) {
    return this.lessonRepository.find({ where: { chatId }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
  }

  // Private helper methods
  private async validateTimeSlotAvailability(createDto: CreateLessonDto): Promise<void> {
    const availableSlots = await this.getAvailableTimeSlots(createDto.teacherId, createDto.lessonDate);
    
    if (!availableSlots.includes(createDto.startTime)) {
      throw new BadRequestException('Selected time slot is not available');
    }
  }

  private calculateEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private generateTimeSlots(startTime: string, endTime: string): string[] {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const slotTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(slotTime);

      // Add 1 hour + 15 minutes for next slot
      currentMinute += 75;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  }

  private async generateGoogleMeetLink(createDto: CreateLessonDto): Promise<string> {
    // TODO: Implement Google Meet link generation
    // For now, return a placeholder
    return `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;
  }

  private async sendLessonConfirmationEmails(lesson: Lesson): Promise<void> {
    // TODO: Implement email sending
    console.log(`Sending confirmation emails for lesson ${lesson.id}`);
  }

  private async sendRescheduleConfirmationEmails(lesson: Lesson, reschedule: LessonReschedule): Promise<void> {
    // TODO: Implement email sending
    console.log(`Sending reschedule confirmation emails for lesson ${lesson.id}`);
  }
} 