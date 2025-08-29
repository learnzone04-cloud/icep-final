import { Controller, Post, Body, Req, UseGuards, Param, Get } from '@nestjs/common';
import { LiveKitService } from './livekit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('livekit')
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) {}

  @UseGuards(JwtAuthGuard)
  @Post('token')
  async getToken(@Body() body: { roomName: string }, @Req() req: Request) {
    return this.liveKitService.buildTokenWithAccessCheck(body.roomName, req.user);
  }

  // Debug endpoint to test token generation without room validation
  @UseGuards(JwtAuthGuard)
  @Get('debug-token/:roomName')
  async getDebugToken(@Param('roomName') roomName: string, @Req() req: Request) {
    const user = req.user as any;
    const userName = (user.name || '').trim().replace(/\s+/g, ' ');
    const userRole = (user.role || '').toLowerCase();
    const identity = `id:${user.id}|name:${userName}|role:${userRole}`;
    
    console.log('Debug token generation:', {
      roomName,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        normalizedRole: userRole
      },
      identity
    });
    
    const token = await this.liveKitService.generateToken(roomName, identity, 3600);
    const wsUrl = 'wss://icep-oha22jm9.livekit.cloud';
    
    return { 
      token, 
      wsUrl, 
      identity,
      debug: {
        roomName,
        userInfo: {
          id: user.id,
          name: user.name,
          role: user.role,
          normalizedRole: userRole
        }
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('room/:roomId/complete')
  async completeRoom(@Param('roomId') roomId: string, @Req() req: Request) {
    // Only teachers can complete rooms
    const user = req.user as any;
    if (user.role !== 'Teacher') {
      throw new Error('Only teachers can complete rooms');
    }
    await this.liveKitService.markRoomAsCompleted(parseInt(roomId));
    return { success: true, message: 'Room marked as completed' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('room/:roomId/cancel')
  async cancelRoom(@Param('roomId') roomId: string, @Req() req: Request) {
    // Only teachers can cancel rooms
    const user = req.user as any;
    if (user.role !== 'Teacher') {
      throw new Error('Only teachers can cancel rooms');
    }
    await this.liveKitService.cancelRoom(parseInt(roomId));
    return { success: true, message: 'Room cancelled' };
  }
}
