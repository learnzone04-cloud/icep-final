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
          student.userId,
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
        teacher.userId,
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
          student.userId,
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
        teacher.userId,
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
        student.userId,
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
        student.userId,
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
          student.userId,
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
            student.userId,
            NotificationType.ARTICLE_CREATED,
            'New Article Available',
            `${teacherName} just published a new article: "${snippet}..."`,
            { teacherId, teacherName, articleId }
          );
          console.log('✅ Notification created for student:', student.userId);
        } catch (error) {
          console.error('❌ Failed to create notification for student:', student.userId, error);
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
          student.userId,
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
          student.userId,
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

  private async getUserByStudentId(studentId: number): Promise<any> {
    console.log('🔍 getUserByStudentId called with studentId:', studentId);
    
    try {
      // Test basic database connection
      console.log('🔍 Testing database connection...');
      
      // Try a simple query to see what database we're in (MySQL syntax)
      const dbInfo = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('DATABASE() as db_name, SCHEMA() as schema_name')
        .getRawOne();
      
      console.log('🔍 Database info:', dbInfo);
      
      // Try to get table count (MySQL syntax)
      const tableCount = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('COUNT(*) as count')
        .from('information_schema.tables', 't')
        .where('t.table_schema = DATABASE()')
        .getRawOne();
      
      console.log('🔍 Total table count:', tableCount);
      
      // Get all tables in current database (MySQL syntax)
      const allTables = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('table_name')
        .from('information_schema.tables', 't')
        .where('t.table_schema = DATABASE()')
        .getRawMany();
      
      console.log('🔍 All tables in database:', allTables.map(t => t.table_name));
      
      // Check if 'student' table exists
      const studentTableExists = allTables.some(t => t.table_name === 'student');
      console.log('🔍 Student table exists:', studentTableExists);
      
      if (!studentTableExists) {
        console.log('❌ Student table not found! Available tables:', allTables.map(t => t.table_name));
        
        // Try different schemas
        const allSchemas = await this.notificationRepo.manager
          .createQueryBuilder()
          .select('DISTINCT table_schema')
          .from('information_schema.tables', 't')
          .getRawMany();
        
        console.log('🔍 Available schemas:', allSchemas.map(s => s.table_schema));
        
        // Try to find student table in any schema
        const studentTableAnySchema = await this.notificationRepo.manager
          .createQueryBuilder()
          .select('table_name, table_schema')
          .from('information_schema.tables', 't')
          .where('t.table_name LIKE :tableName', { tableName: '%student%' })
          .getRawMany();
        
        console.log('🔍 Student-like tables found:', studentTableAnySchema);
        
        return null;
      }
      
      // Check the structure of the student table
      const studentColumns = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('column_name, data_type')
        .from('information_schema.columns', 'c')
        .where('c.table_name = :tableName AND c.table_schema = DATABASE()', { tableName: 'student' })
        .getRawMany();
      
      console.log('🔍 Student table columns:', studentColumns);
      
      // First, let's see what's in the student table
      const allStudents = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('s.id, s.userId')
        .from('student', 's')
        .getRawMany();
      
      console.log('🔍 All students in database:', allStudents);
      
      // Now search for our specific student
      const student = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('s.userId')
        .from('student', 's')
        .where('s.id = :studentId', { studentId })
        .getRawOne();
      
      console.log('🔍 getUserByStudentId query result for studentId', studentId, ':', student);
      
      // Also check if the student exists at all
      const studentExists = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('s.id')
        .from('student', 's')
        .where('s.id = :studentId', { studentId })
        .getRawOne();
      
      console.log('🔍 Student with id', studentId, 'exists:', !!studentExists);
      
      // Try a different approach - get all columns
      const fullStudent = await this.notificationRepo.manager
        .createQueryBuilder()
        .select('*')
        .from('student', 's')
        .where('s.id = :studentId', { studentId })
        .getRawOne();
      
      console.log('🔍 Full student record:', fullStudent);
      
      return student;
    } catch (error) {
      console.error('❌ Error in getUserByStudentId:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      return null;
    }
  }

  private async getUserByTeacherId(teacherId: number): Promise<any> {
    return this.notificationRepo.manager
      .createQueryBuilder()
      .select('t.userId')
      .from('teacher', 't')
      .where('t.id = :teacherId', { teacherId })
      .getRawOne();
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