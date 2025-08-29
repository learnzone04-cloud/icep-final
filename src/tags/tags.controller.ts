import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  Request,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  // Admin only: Create new tag
  @Post()
  @UseGuards(AdminAuthGuard)
  async createTag(@Body() createTagDto: CreateTagDto) {
    this.logger.log(`Creating tag: ${createTagDto.name} for type: ${createTagDto.typeId}`);
    
    // Check if tag already exists
    const exists = await this.tagsService.tagExists(createTagDto.name, createTagDto.typeId);
    if (exists) {
      throw new Error(`Tag '${createTagDto.name}' already exists for this type`);
    }

    const tag = await this.tagsService.createTag(createTagDto);
    this.logger.log(`Tag created successfully: ${tag.name}`);
    
    return {
      success: true,
      message: 'Tag created successfully',
      tag,
    };
  }

  // Admin only: Get all tags
  @Get('admin/all')
  @UseGuards(AdminAuthGuard)
  async getAllTags() {
    this.logger.log('Admin requesting all tags');
    const tagsByType = await this.tagsService.getTagsOrderedByType();
    
    return {
      success: true,
      tagsByType,
      totalCount: Object.values(tagsByType).reduce((acc: number, tags: any[]) => acc + tags.length, 0),
    };
  }

  // Get tags by teacher's type (extracted from JWT token)
  @Get('type')
  @UseGuards(JwtAuthGuard)
  async getTagsByType(@Request() req: any) {
    // Check if user is a teacher
    if (req.user.role !== 'Teacher') {
      throw new Error('Only teachers can access this endpoint');
    }

    // Get user ID from the JWT token
    const userId = req.user.id;
    if (!userId) {
      throw new Error('User ID not found in token');
    }

    this.logger.log(`Getting tags for teacher user ID: ${userId}`);
    const tags = await this.tagsService.getTagsByTeacherType(userId);
    
    return {
      success: true,
      tags,
      totalCount: tags.length,
      userId: userId,
    };
  }

  // Admin only: Get tag by ID
  @Get('admin/:id')
  @UseGuards(AdminAuthGuard)
  async getTagById(@Param('id') id: string) {
    const tagId = parseInt(id);
    const tag = await this.tagsService.getTagById(tagId);
    
    if (!tag) {
      throw new Error(`Tag with ID ${tagId} not found`);
    }

    return {
      success: true,
      tag,
    };
  }

  // Admin only: Update tag
  @Put('admin/:id')
  @UseGuards(AdminAuthGuard)
  async updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const tagId = parseInt(id);
    this.logger.log(`Updating tag ID: ${tagId}`);
    
    const tag = await this.tagsService.updateTag(tagId, updateTagDto);
    
    return {
      success: true,
      message: 'Tag updated successfully',
      tag,
    };
  }

  // Admin only: Delete tag
  @Delete('admin/:id')
  @UseGuards(AdminAuthGuard)
  async deleteTag(@Param('id') id: string) {
    const tagId = parseInt(id);
    this.logger.log(`Deleting tag ID: ${tagId}`);
    
    await this.tagsService.deleteTag(tagId);
    
    return {
      success: true,
      message: 'Tag deleted successfully',
    };
  }

  // Health check
  @Get('health')
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date(),
      message: 'Tags service is running',
    };
  }
}



