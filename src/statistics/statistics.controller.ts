import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserEntity, UserRole } from '../users/entity/User';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { ReelEntity } from '../reels/entity/Reel';
import { ArticleEntity } from '../article/entity/Article';
import { ShortVideoEntity } from '../short-video/entity/ShortVideo';
import { Course } from '../course/entities/course.entity';
import { EnrollCourseStudent } from '../enroll-course-student/entity/EnrollCourseStudent.entity';
import { CourseModule } from '../course/course.module';
import { EnrollCourseStudentModule } from '../enroll-course-student/enroll-course-student.module';
import { MoreThanOrEqual } from 'typeorm';

@Controller('statistics')
export class StatisticsController {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(TeacherEntity) private teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(ReelEntity) private reelRepo: Repository<ReelEntity>,
    @InjectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(ShortVideoEntity) private shortVideoRepo: Repository<ShortVideoEntity>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(EnrollCourseStudent) private enrollRepo: Repository<EnrollCourseStudent>,
  ) {}

  @Get('students-this-month')
  async getStudentsThisMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await this.userRepo.count({
      where: {
        role: UserRole.Student,
        createdAt: MoreThanOrEqual(firstDay),
      },
    });
    return { count };
  }

  @Get('teachers-this-month')
  async getTeachersThisMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await this.userRepo.count({
      where: {
        role: UserRole.Teacher,
        createdAt: MoreThanOrEqual(firstDay),
      },
    });
    return { count };
  }

  @Get('reels-this-month')
  async getReelsThisMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await this.reelRepo.count({
      where: { createdAt: MoreThanOrEqual(firstDay) },
    });
    return { count };
  }

  @Get('articles-this-month')
  async getArticlesThisMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await this.articleRepo.count({
      where: { createdAt: MoreThanOrEqual(firstDay) },
    });
    return { count };
  }

  @Get('short-videos-this-month')
  async getShortVideosThisMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await this.shortVideoRepo.count({
      where: { createdAt: MoreThanOrEqual(firstDay) },
    });
    return { count };
  }

  @Get('top-courses')
  async getTopCourses() {
    const result = await this.enrollRepo
      .createQueryBuilder('enroll')
      .select('enroll.courseId', 'courseId')
      .addSelect('COUNT(enroll.id)', 'enrollCount')
      .groupBy('enroll.courseId')
      .orderBy('enrollCount', 'DESC')
      .limit(5)
      .getRawMany();
    const courses = await Promise.all(
      result.map(async (row) => {
        const course = await this.courseRepo.findOne({ where: { id: row.courseId } });
        return { course, enrollCount: Number(row.enrollCount) };
      })
    );
    return courses;
  }

  // New APIs for monthly breakdowns
  @Get('monthly/students')
  async getMonthlyStudents() {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const firstDay = new Date(currentYear, month - 1, 1);
      const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
      
      const count = await this.userRepo.count({
        where: {
          role: UserRole.Student,
          createdAt: Between(firstDay, lastDay),
        },
      });
      
      monthlyData.push({
        month: month,
        monthName: firstDay.toLocaleString('default', { month: 'long' }),
        year: currentYear,
        count: count
      });
    }
    
    return {
      year: currentYear,
      monthlyData: monthlyData
    };
  }

  @Get('monthly/teachers')
  async getMonthlyTeachers() {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const firstDay = new Date(currentYear, month - 1, 1);
      const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
      
      const count = await this.userRepo.count({
        where: {
          role: UserRole.Teacher,
          createdAt: Between(firstDay, lastDay),
        },
      });
      
      monthlyData.push({
        month: month,
        monthName: firstDay.toLocaleString('default', { month: 'long' }),
        year: currentYear,
        count: count
      });
    }
    
    return {
      year: currentYear,
      monthlyData: monthlyData
    };
  }

  @Get('monthly/reels')
  async getMonthlyReels() {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const firstDay = new Date(currentYear, month - 1, 1);
      const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
      
      const count = await this.reelRepo.count({
        where: {
          createdAt: Between(firstDay, lastDay),
        },
      });
      
      monthlyData.push({
        month: month,
        monthName: firstDay.toLocaleString('default', { month: 'long' }),
        year: currentYear,
        count: count
      });
    }
    
    return {
      year: currentYear,
      monthlyData: monthlyData
    };
  }

  @Get('monthly/articles')
  async getMonthlyArticles() {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const firstDay = new Date(currentYear, month - 1, 1);
      const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
      
      const count = await this.articleRepo.count({
        where: {
          createdAt: Between(firstDay, lastDay),
        },
      });
      
      monthlyData.push({
        month: month,
        monthName: firstDay.toLocaleString('default', { month: 'long' }),
        year: currentYear,
        count: count
      });
    }
    
    return {
      year: currentYear,
      monthlyData: monthlyData
    };
  }

  @Get('monthly/short-videos')
  async getMonthlyShortVideos() {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const firstDay = new Date(currentYear, month - 1, 1);
      const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
      
      const count = await this.shortVideoRepo.count({
        where: {
          createdAt: Between(firstDay, lastDay),
        },
      });
      
      monthlyData.push({
        month: month,
        monthName: firstDay.toLocaleString('default', { month: 'long' }),
        year: currentYear,
        count: count
      });
    }
    
    return {
      year: currentYear,
      monthlyData: monthlyData
    };
  }

  // Get all monthly statistics at once
  @Get('monthly/all')
  async getAllMonthlyStatistics() {
    const [students, teachers, reels, articles, shortVideos] = await Promise.all([
      this.getMonthlyStudents(),
      this.getMonthlyTeachers(),
      this.getMonthlyReels(),
      this.getMonthlyArticles(),
      this.getMonthlyShortVideos()
    ]);

    return {
      year: students.year,
      students: students.monthlyData,
      teachers: teachers.monthlyData,
      reels: reels.monthlyData,
      articles: articles.monthlyData,
      shortVideos: shortVideos.monthlyData
    };
  }
} 