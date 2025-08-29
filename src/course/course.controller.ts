import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseVideoEntity } from '../course-video/entity/course-video.entity';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { UserEntity } from '../users/entity/User';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(CourseVideoEntity) private videoRepo: Repository<CourseVideoEntity>,
    @InjectRepository(TeacherEntity) private teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.courseService.create(req.user.id ,createCourseDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.courseService.findByUserType(req.user);
  }

  @Get('unapproved-videos')
  async getUnapprovedVideosGroupedByCourse() {
    const videos = await this.videoRepo.find({ where: { approaved: false }, relations: ['course'] });
    const grouped = {};
    for (const video of videos) {
      const course = await this.courseRepo.findOne({ where: { id: video.courseId }, relations: ['teacher'] });
      if (!course) continue;
      const teacher = await this.teacherRepo.findOne({ where: { id: course.teacherId }, relations: ['user'] });
      const teacherName = teacher && teacher.user ? `${teacher.user.fName} ${teacher.user.lName}` : '';
      if (!grouped[course.id]) {
        grouped[course.id] = {
          courseId: course.id,
          courseTitle: course.title,
          teacherName,
          videos: [],
        };
      }
      grouped[course.id].videos.push(video);
    }
    return Object.values(grouped);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.courseService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.courseService.delete(+id);
  }
}
