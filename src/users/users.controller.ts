import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
// import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { GmailService } from 'src/gmail/gmail.service';
import { AdminAuthService } from 'src/admin-auth/admin-auth.service';
//import { RolesGuard } from 'src/auth/roles.guard';

@Controller('authentication')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly gmailService: GmailService,
    private readonly adminAuthService: AdminAuthService,
  ) {}

  @Get('status')
  user(@Request() req: any) {
    console.log(req.user);
    if (req.user) {
      return {
        msg: 'Authenticated',
      };
    } else {
      return {
        msg: 'Unt Authenticated',
      };
    }
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return this.authService.login(req.body);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/register')
  register(@Request() req, @Body() createUserDto: CreateUserDto): any {
    return this.authService.register(createUserDto);
  }

  // @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getMyProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/teacherRequest')
  getTeacherRequest() {
    return this.userService.findTeacherRequest();
  }

  @UseGuards(AdminAuthGuard)
  @Get('/pendingTeacherRequests')
  getPendingTeacherRequests() {
    return this.userService.findPendingTeacherRequests();
  }

  @UseGuards(AdminAuthGuard)
  @Get('/approvedTeachers')
  getApprovedTeachers() {
    return this.userService.findApprovedTeachers();
  }

  @UseGuards(AdminAuthGuard)
  @Get('/students')
  getAllStudents() {
    return this.userService.findAllStudentsOrderedByType();
  }

  @UseGuards(AdminAuthGuard)
  @Get('/teacher/:id')
  getTeacherById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findTeacherById(id);
  }

  @UseGuards(AdminAuthGuard) // Changed from JwtAuthGuard to AdminAuthGuard
  @Patch('/approveTeacher/:id')
  async approveTeacherRequest(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Get teacher info before approval
    const teacher = await this.userService.findOneById(id);
    if (!teacher) {
      return {
        success: false,
        message: 'Teacher not found'
      };
    }

    // Approve the teacher
    const result = await this.userService.update(id, { active: true });
    
    // Get admin's YouTube tokens (which include Gmail access)
    const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
    
    // Send approval email using admin's OAuth2 client
    let emailResult = null;
    try {
      if (youtubeTokens) {
        // Create OAuth2 client with admin's tokens
        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_ADMIN_REDIRECT_URI
        );
        oauth2Client.setCredentials({
          access_token: youtubeTokens.accessToken,
          refresh_token: youtubeTokens.refreshToken
        });
        
        emailResult = await this.gmailService.sendTeacherApprovalEmailWithOAuth(
          oauth2Client,
          teacher.email, 
          `${teacher.fName} ${teacher.lName}` || teacher.email
        );
      } else {
        throw new Error('Admin does not have Gmail access');
      }
    } catch (error) {
      console.error('Failed to send approval email:', error.message);
      // Continue with approval even if email fails
    }

    return {
      ...result,
      approvedBy: {
        id: req.user.id,
        email: req.user.email,
        name: `${req.user.fName} ${req.user.lName}`,
        role: req.user.role
      },
      approvedAt: new Date().toISOString(),
      emailSent: emailResult ? true : false,
      emailError: emailResult ? null : 'Failed to send approval email'
    };
  }

  @UseGuards(AdminAuthGuard)
  @Delete('/disapproveTeacher/:id')
  async disapproveTeacherRequest(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: { reasons: string },
    @Request() req
  ) {
    // Get teacher info before disapproval
    const teacher = await this.userService.findOneById(id);
    if (!teacher) {
      return {
        success: false,
        message: 'Teacher not found'
      };
    }

    // Delete the teacher record from teacher table first (due to foreign key constraints)
    if (teacher.teacher) {
      await this.userService.deleteTeacherRecord(teacher.teacher.id);
    }

    // Delete the user record
    const result = await this.userService.delete(id);
    
    // Get admin's YouTube tokens (which include Gmail access)
    const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
    
    // Send disapproval email using admin's OAuth2 client
    let emailResult = null;
    try {
      if (youtubeTokens) {
        // Create OAuth2 client with admin's tokens
        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_ADMIN_REDIRECT_URI
        );
        oauth2Client.setCredentials({
          access_token: youtubeTokens.accessToken,
          refresh_token: youtubeTokens.refreshToken
        });
        
        emailResult = await this.gmailService.sendTeacherDisapprovalEmailWithOAuth(
          oauth2Client,
          teacher.email, 
          `${teacher.fName} ${teacher.lName}` || teacher.email,
          body.reasons
        );
      } else {
        throw new Error('Admin does not have Gmail access');
      }
    } catch (error) {
      console.error('Failed to send disapproval email:', error.message);
      // Continue with disapproval even if email fails
    }

    return {
      ...result,
      disapprovedBy: {
        id: req.user.id,
        email: req.user.email,
        name: `${req.user.fName} ${req.user.lName}`,
        role: req.user.role
      },
      disapprovedAt: new Date().toISOString(),
      reasons: body.reasons,
      emailSent: emailResult ? true : false,
      emailError: emailResult ? null : 'Failed to send disapproval email'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/')
  updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto): any {
    return this.authService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  deleteUser(@Request() req): any {
    return this.authService.delete(req.user.id);
  }
}
