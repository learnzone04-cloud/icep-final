import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Patch,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReelsService } from './reels.service';
import { CreateReelDto } from './dtos/create-reel.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { join } from 'path';
import * as fs from 'fs';
import { Response, Request } from 'express';
import { UpdateReelDto } from './dtos/update-reel.dto';

@Controller('reels')
export class ReelsController {
  constructor(private readonly reelService: ReelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos', // folder to store uploaded videos
        filename: (req, file, callback) => {
          const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        callback(null, true);
      },
    }),
  )
  addReel(
    @Req() req,
    @UploadedFile() video: Express.Multer.File,
    @Body() createTeacherDto: CreateReelDto,
  ): any {
    if (!video) {
      throw new Error('Video file is required');
    }
    createTeacherDto.reelPath = video.filename;
    return this.reelService.createReel(req.user.id, createTeacherDto, video);
  }

  @Get('stream/:filename')
  async streamVideo(
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const videoPath = join('uploads', 'videos', filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoPath).pipe(res);
    } else {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getReel(@Req() req) {
    return this.reelService.findByUserType(req.user);
  }

  // New endpoint: Get reels with recommendation scoring for students
  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getReelsWithRecommendations(@Req() req) {
    const userId = req.user?.id;
    const typeId = req.user?.typeId; // Get typeId from JWT token
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!typeId) {
      throw new Error('User type not found in token');
    }

    return this.reelService.findReelsWithRecommendations(userId, typeId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteReel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.reelService.delete(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateReel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReelDto
  ) {
    return this.reelService.update(id, body);
  }
}
