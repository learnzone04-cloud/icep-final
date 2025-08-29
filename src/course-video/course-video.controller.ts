import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { AdminAuthService } from 'src/admin-auth/admin-auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CourseVideoService } from './course-video.service';

@Controller('course-video')
export class CourseVideoController {
    constructor(
        private service: CourseVideoService,
        private adminAuthService: AdminAuthService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/:id')
    @UseInterceptors(
        FileInterceptor('video', {
        storage: diskStorage({
            destination: './uploads/videos', 
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
        @Param('id' , ParseIntPipe) id: number,
        @UploadedFile() video: Express.Multer.File,
        @Body() createTeacherDto: { title: string, description:string },
        
    ): any {
        return this.service.create(id, createTeacherDto, video.path);
    }

    @Post('/approve/:id')
    @UseGuards(AdminAuthGuard) // Changed from JwtAuthGuard to AdminAuthGuard
    async approveCourse(@Param('id' , ParseIntPipe) id: number, @Req() req) {
        // Get YouTube tokens for this admin
        const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
        
        // Check if admin has YouTube access
        if (!youtubeTokens) {
            return {
                success: false,
                message: 'Admin does not have YouTube access. Please login again with YouTube permissions.',
                user: req.user
            };
        }
        
        // Approve video using admin's YouTube tokens
        const result = await this.service.approveVideo(id, youtubeTokens);
        
        return {
            ...result,
            approvedBy: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role
            },
            approvedAt: new Date().toISOString(),
            youtubeAccess: true
        };
    }

    @Delete('/disapprove/:id')
    @UseGuards(AdminAuthGuard)
    async disapproveVideo(@Param('id', ParseIntPipe) id: number, @Req() req) {
        // Get YouTube tokens for this admin
        const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
        
        // Check if admin has YouTube access
        if (!youtubeTokens) {
            return {
                success: false,
                message: 'Admin does not have YouTube access. Please login again with YouTube permissions.',
                user: req.user
            };
        }
        
        // Disapprove and delete video using admin's YouTube tokens
        const result = await this.service.disapproveVideo(id, youtubeTokens);
        
        return {
            ...result,
            disapprovedBy: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role
            },
            disapprovedAt: new Date().toISOString(),
            youtubeAccess: true
        };
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    getCourseVideo(@Param('id' , ParseIntPipe) id: number) {
        return this.service.findAllByCourseId(id);
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    editVideoDescription(@Param('id' , ParseIntPipe) id: number , @Body() body : {description : string}) {
        return this.service.editDescreption(id, body);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    deleteCourseVideo(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}

