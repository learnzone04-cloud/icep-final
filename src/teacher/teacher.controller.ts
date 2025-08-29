import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateTeacherProfileDto } from './dtos/update-teacher-profile.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    return this.teacherService.findByUserType(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.teacherService.findOneByUserType(req.user, id);
  }

  @Post('/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'certificates', maxCount: 10 }, // Adjust maxCount as needed
        { name: 'cv', maxCount: 1 }, // Only one CV
      ],
      {
        storage: diskStorage({
          destination: './uploads/teacher', // folder to store uploaded files
          filename: (req, file, callback) => {
            const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
            callback(null, uniqueFileName);
          },
        }),
        fileFilter: (req, file, callback) => {
          callback(null, true);
        },
      },
    ),
  )
  async completeProfile(
    @Request() req,
    @UploadedFiles()
    files: { certificates?: Express.Multer.File[]; cv?: Express.Multer.File[] },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    const cvPath = files.cv[0]?.filename; // assuming the CV file is present
    const certificatePaths = files.certificates.map((file) => file.filename);
    const createTeacherDto = { ...req.body };

    return this.teacherService.createTeacher(
      id,
      cvPath,
      certificatePaths,
      createTeacherDto,
    );
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateTeacherProfile(
    @Request() req,
    @Body() updateTeacherProfileDto: UpdateTeacherProfileDto,
  ) {
    const userId = req.user.id;
    console.log(req.body);
    return this.teacherService.updateProfile(userId, updateTeacherProfileDto);
  }

  @Put('profile/cv')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/teacher',
          filename: (req, file, callback) => {
            const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
            callback(null, uniqueFileName);
          },
        }),
      },
    ),
  )
  async updateTeacherCV(
    @Request() req,
    @UploadedFiles()
    files: { cv?: Express.Multer.File[] },
  ) {
    const userId = req.user.id;
    const cvPath = files.cv?.[0]?.filename;
    
    if (!cvPath) {
      throw new Error('CV file is required');
    }

    return this.teacherService.updateCV(userId, cvPath);
  }

  @Get('articles')
  @UseGuards(JwtAuthGuard)
  async getTeacherArticles(@Request() req) {
    const userId = req.user.id;
    return this.teacherService.getTeacherArticles(userId);
  }

  @Get('reels')
  @UseGuards(JwtAuthGuard)
  async getTeacherReels(@Request() req) {
    const userId = req.user.id;
    return this.teacherService.getTeacherReels(userId);
  }

  @Get('courses')
  @UseGuards(JwtAuthGuard)
  async getTeacherCourses(@Request() req) {
    const userId = req.user.id;
    return this.teacherService.getTeacherCourses(userId);
  }
}
