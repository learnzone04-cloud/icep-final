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

  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId,
      type,
      title,
      message,
      data,
      status: NotificationStatus.UNREAD
    });

    const savedNotification = await this.notificationRepo.save(notification);
    
    // Send real-time notification
    this.notificationGateway.sendNotificationToUser(userId, savedNotification);
    
    return savedNotification;
  }

  async sendRoomCreatedNotification(roomId: number, roomTitle: string, teacherName: string, studentIds: number[]) {
    for (const studentId of studentIds) {
      await this.createNotification(
        studentId,
        NotificationType.ROOM_CREATED,
        'New Conversation Room Available',
        `A new room "${roomTitle}" by ${teacherName} is now available for enrollment.`,
        { roomId, roomTitle, teacherName }
      );
    }
  }

  async sendRoomEnrollmentNotification(roomId: number, roomTitle: string, studentName: string, teacherId: number) {
    await this.createNotification(
      teacherId,
      NotificationType.ROOM_ENROLLMENT,
      'New Student Enrollment',
      `${studentName} has enrolled in your room "${roomTitle}".`,
      { roomId, roomTitle, studentName }
    );
  }

  async sendRoomStartingNotification(roomId: number, roomTitle: string, startTime: Date, userIds: number[]) {
    for (const userId of userIds) {
      await this.createNotification(
        userId,
        NotificationType.ROOM_STARTING,
        'Room Starting Soon',
        `Your conversation room "${roomTitle}" starts in 15 minutes.`,
        { roomId, roomTitle, startTime }
      );
    }
  }

  async sendRoomCancelledNotification(roomId: number, roomTitle: string, userIds: number[]) {
    for (const userId of userIds) {
      await this.createNotification(
        userId,
        NotificationType.ROOM_CANCELLED,
        'Room Cancelled',
        `The conversation room "${roomTitle}" has been cancelled.`,
        { roomId, roomTitle }
      );
    }
  }

  async sendPaymentSuccessNotification(userId: number, amount: number, roomTitle: string) {
    await this.createNotification(
      userId,
      NotificationType.PAYMENT_SUCCESS,
      'Payment Successful',
      `Payment of $${amount} for "${roomTitle}" was successful.`,
      { amount, roomTitle }
    );
  }

  async sendPaymentFailedNotification(userId: number, amount: number, roomTitle: string) {
    await this.createNotification(
      userId,
      NotificationType.PAYMENT_FAILED,
      'Payment Failed',
      `Payment of $${amount} for "${roomTitle}" failed. Please try again.`,
      { amount, roomTitle }
    );
  }

  async sendReelCreatedNotification(teacherId: number, teacherName: string, reelId: number, reelDescription: string) {
    // Get all students who follow this teacher
    const followers = await this.getTeacherFollowers(teacherId);
    
    for (const follower of followers) {
      await this.createNotification(
        follower.studentId,
        NotificationType.REEL_CREATED,
        'New Reel Available',
        `${teacherName} just posted a new reel: "${reelDescription}"`,
        { teacherId, teacherName, reelId, reelDescription }
      );
    }
  }

  async sendArticleCreatedNotification(teacherId: number, teacherName: string, articleId: number, articleContentSnippet: string) {
    const followers = await this.getTeacherFollowers(teacherId);
    const snippet = (articleContentSnippet || '').slice(0, 40);
    
    for (const follower of followers) {
      await this.createNotification(
        follower.studentId,
        NotificationType.ARTICLE_CREATED,
        'New Article Available',
        `${teacherName} just published a new article: "${snippet}..."`,
        { teacherId, teacherName, articleId }
      );
    }
  }

  async sendShortVideoCreatedNotification(teacherId: number, teacherName: string, videoId: number, videoDescription: string) {
    const followers = await this.getTeacherFollowers(teacherId);
    const snippet = (videoDescription || '').slice(0, 40);
    
    for (const follower of followers) {
      await this.createNotification(
        follower.studentId,
        NotificationType.SHORT_VIDEO_CREATED,
        'New Short Video Available',
        `${teacherName} just uploaded a new short video: "${snippet}..."`,
        { teacherId, teacherName, videoId }
      );
    }
  }

  async sendCourseCreatedNotification(teacherId: number, teacherName: string, courseId: number, courseTitle: string) {
    const followers = await this.getTeacherFollowers(teacherId);
    
    for (const follower of followers) {
      await this.createNotification(
        follower.studentId,
        NotificationType.COURSE_CREATED,
        'New Course Available',
        `${teacherName} just created a new course: "${courseTitle}"`,
        { teacherId, teacherName, courseId, courseTitle }
      );
    }
  }

  private async getTeacherFollowers(teacherId: number): Promise<any[]> {
    return this.notificationRepo.manager
      .createQueryBuilder()
      .select('f.studentId')
      .from('follower', 'f')
      .where('f.teacherId = :teacherId', { teacherId })
      .getRawMany();
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