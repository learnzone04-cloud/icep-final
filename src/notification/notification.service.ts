import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entity/Notification';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // Test method to check if notifications work
  async testNotification(userId: number): Promise<Notification> {
    console.log('🧪 testNotification called with userId:', userId);
    
    try {
      const notification = await this.createNotification(
        userId,
        NotificationType.ARTICLE_CREATED,
        'Test Notification',
        'This is a test notification to check if the system works.',
        { test: true, timestamp: new Date().toISOString() }
      );
      
      console.log('✅ Test notification created successfully:', notification.id);
      return notification;
    } catch (error) {
      console.error('❌ Test notification failed:', error);
      throw error;
    }
  }

  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    console.log('📝 createNotification called with:', { userId, type, title, message });
    
    try {
      const notification = this.notificationRepo.create({
        userId,
        type,
        title,
        message,
        data,
        status: NotificationStatus.UNREAD
      });

      const savedNotification = await this.notificationRepo.save(notification);
      console.log('💾 Notification saved to database:', savedNotification.id);
      
      // Send real-time notification
      this.notificationGateway.sendNotificationToUser(userId, savedNotification);
      console.log('📡 Real-time notification sent to user:', userId);
      
      return savedNotification;
    } catch (error) {
      console.error('❌ Error in createNotification:', error);
      throw error;
    }
  }

  async sendRoomCreatedNotification(roomId: number, roomTitle: string, teacherName: string, studentIds: number[]) {
    for (const studentId of studentIds) {
      // Get userId from studentId
      const student = await this.getUserByStudentId(studentId);
      if (student) {
        await this.createNotification(
          student,
          NotificationType.ROOM_CREATED,
          'New Conversation Room Available',
          `A new room "${roomTitle}" by ${teacherName} is now available for enrollment.`,
          { roomId, roomTitle, teacherName }
        );
      }
    }
  }

  async sendRoomEnrollmentNotification(roomId: number, roomTitle: string, studentName: string, teacherId: number) {
    // Get userId from teacherId
    const teacher = await this.getUserByTeacherId(teacherId);
    if (teacher) {
      await this.createNotification(
        teacher,
        NotificationType.ROOM_ENROLLMENT,
        'New Student Enrollment',
        `${studentName} has enrolled in your room "${roomTitle}".`,
        { roomId, roomTitle, studentName }
      );
    }
  }

  async sendRoomStartingNotification(roomId: number, roomTitle: string, startTime: Date, studentIds: number[], teacherId: number) {
    // Send to students
    for (const studentId of studentIds) {
      const student = await this.getUserByStudentId(studentId);
      if (student) {
        await this.createNotification(
          student,
          NotificationType.ROOM_STARTING,
          'Room Starting Soon',
          `Your conversation room "${roomTitle}" starts in 15 minutes.`,
          { roomId, roomTitle, startTime }
        );
      }
    }

    // Send to teacher
    const teacher = await this.getUserByTeacherId(teacherId);
    if (teacher) {
      await this.createNotification(
        teacher,
        NotificationType.ROOM_STARTING,
        'Room Starting Soon',
        `Your conversation room "${roomTitle}" starts in 15 minutes.`,
        { roomId, roomTitle, startTime }
      );
    }
  }

  async sendPaymentSuccessNotification(studentId: number, amount: number, roomTitle: string) {
    const student = await this.getUserByStudentId(studentId);
    if (student) {
      await this.createNotification(
        student,
        NotificationType.PAYMENT_SUCCESS,
        'Payment Successful',
        `Payment of $${amount} for "${roomTitle}" was successful.`,
        { amount, roomTitle }
      );
    }
  }

  async sendPaymentFailedNotification(studentId: number, amount: number, roomTitle: string) {
    const student = await this.getUserByStudentId(studentId);
    if (student) {
      await this.createNotification(
        student,
        NotificationType.PAYMENT_FAILED,
        'Payment Failed',
        `Payment of $${amount} for "${roomTitle}" failed. Please try again.`,
        { amount, roomTitle }
      );
    }
  }

  async sendReelCreatedNotification(teacherId: number, teacherName: string, reelId: number, reelDescription: string) {
    // Get all students who follow this teacher
    const followers = await this.getTeacherFollowers(teacherId);
    
    for (const follower of followers) {
      const student = await this.getUserByStudentId(follower.f_studentId);
      if (student) {
        await this.createNotification(
          student,
          NotificationType.REEL_CREATED,
          'New Reel Available',
          `${teacherName} just posted a new reel: "${reelDescription}"`,
          { teacherId, teacherName, reelId, reelDescription }
        );
      }
    }
  }

  async sendArticleCreatedNotification(teacherId: number, teacherName: string, articleId: number, articleContentSnippet: string) {
    console.log('🔔 sendArticleCreatedNotification called with:', { teacherId, teacherName, articleId });
    
    const followers = await this.getTeacherFollowers(teacherId);
    console.log('📱 Found followers:', followers);
    
    const snippet = (articleContentSnippet || '').slice(0, 40);
    
    if (followers.length === 0) {
      console.log('⚠️ No followers found for teacher, no notifications will be sent');
      return;
    }
    
    for (const follower of followers) {
      console.log('👤 Processing follower:', follower);
      const student = await this.getUserByStudentId(follower.f_studentId);
      console.log('🎓 Found student:', student);
      
      if (student) {
        try {
          await this.createNotification(
            student,
            NotificationType.ARTICLE_CREATED,
            'New Article Available',
            `${teacherName} just published a new article: "${snippet}..."`,
            { teacherId, teacherName, articleId }
          );
          console.log('✅ Notification created for student:', student);
        } catch (error) {
          console.error('❌ Failed to create notification for student:', student, error);
        }
      } else {
        console.log('⚠️ Student not found for follower:', follower);
      }
    }
  }

  async sendShortVideoCreatedNotification(teacherId: number, teacherName: string, videoId: number, videoDescription: string) {
    const followers = await this.getTeacherFollowers(teacherId);
    const snippet = (videoDescription || '').slice(0, 40);
    
    for (const follower of followers) {
      const student = await this.getUserByStudentId(follower.f_studentId);
      if (student) {
        await this.createNotification(
          student,
          NotificationType.SHORT_VIDEO_CREATED,
          'New Short Video Available',
          `${teacherName} just uploaded a new short video: "${snippet}..."`,
          { teacherId, teacherName, videoId }
        );
      }
    }
  }

  async sendCourseCreatedNotification(teacherId: number, teacherName: string, courseId: number, courseTitle: string) {
    const followers = await this.getTeacherFollowers(teacherId);
    
    for (const follower of followers) {
      const student = await this.getUserByStudentId(follower.f_studentId);
      if (student) {
        await this.createNotification(
          student,
          NotificationType.COURSE_CREATED,
          'New Course Available',
          `${teacherName} just created a new course: "${courseTitle}"`,
          { teacherId, teacherName, courseId }
        );
      }
    }
  }

  private async getTeacherFollowers(teacherId: number): Promise<any[]> {
    console.log('🔍 getTeacherFollowers called with teacherId:', teacherId);
    
    try {
      const followers = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('f.studentId')
        .from('follower', 'f')
        .where('f.teacherId = :teacherId', { teacherId })
        .getRawMany();
      
      console.log('🔍 Raw followers query result:', followers);
      return followers;
    } catch (error) {
      console.error('❌ Error in getTeacherFollowers:', error);
      return [];
    }
  }

  private async getUserByStudentId(studentId: number): Promise<number | null> {
    console.log('🔍 getUserByStudentId called with studentId:', studentId);
    
    try {
      // Explicitly alias the column to get { userId: 4 } instead of { s_userId: 4 }
      const student = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('s.userId', 'userId')
        .from('student', 's')
        .where('s.id = :studentId', { studentId })
        .getRawOne();
      
      console.log('🔍 getUserByStudentId query result:', student);
      
      if (student?.userId) {
        console.log('✅ Student found with userId:', student.userId);
        return student.userId; // Return just the number
      } else {
        console.log('❌ Student not found or missing userId:', student);
        return null;
      }
    } catch (error) {
      console.error('❌ Error in getUserByStudentId:', error);
      return null;
    }
  }

  private async getUserByTeacherId(teacherId: number): Promise<number | null> {
    try {
      const teacher = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('t.userId', 'userId')
        .from('teachers', 't')
        .where('t.id = :teacherId', { teacherId })
        .getRawOne();
      
      return teacher?.userId || null;
    } catch (error) {
      console.error('❌ Error in getUserByTeacherId:', error);
      return null;
    }
  }

  async getUserNotifications(userId: number, limit = 20, offset = 0): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async markAsRead(notificationId: number, userId: number): Promise<void> {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { status: NotificationStatus.READ }
    );
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepo.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ }
    );
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepo.count({
      where: { userId, status: NotificationStatus.UNREAD }
    });
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    await this.notificationRepo.delete({ id: notificationId, userId });
  }
} 