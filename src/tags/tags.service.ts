import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/Tag';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private teacherService: TeacherService,
  ) {}

  // Create new tag (Admin only)
  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  // Get all tags by typeId (for teachers)
  async getTagsByType(typeId: number): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { typeId },
      order: { name: 'ASC' },
    });
  }

  // Get tags by teacher's type (extracted from JWT token)
  async getTagsByTeacherType(userId: number): Promise<Tag[]> {
    const teacher = await this.teacherService.findOneByUser(userId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    
    return await this.tagRepository.find({
      where: { typeId: teacher.typeId },
      order: { name: 'ASC' },
    });
  }

  // Get all tags (Admin only)
  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.find({
      order: { typeId: 'ASC', name: 'ASC' },
    });
  }

  // Get tags ordered by type (Admin only)
  async getTagsOrderedByType(): Promise<{ [key: string]: Tag[] }> {
    const allTags = await this.tagRepository.find({
      relations: ['type'],
      order: { typeId: 'ASC', name: 'ASC' },
    });

    // Group tags by type name
    const tagsByType: { [key: string]: Tag[] } = {};
    
    allTags.forEach(tag => {
      const typeName = tag.type?.name || `Type ${tag.typeId}`;
      if (!tagsByType[typeName]) {
        tagsByType[typeName] = [];
      }
      tagsByType[typeName].push(tag);
    });

    return tagsByType;
  }

  // Get tag by ID
  async getTagById(id: number): Promise<Tag> {
    return await this.tagRepository.findOne({ where: { id } });
  }

  // Update tag (Admin only)
  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    // Only allow updating the name, not the typeId
    const { name } = updateTagDto;
    
    if (name !== undefined) {
      await this.tagRepository.update(id, { name });
    }
    
    return await this.getTagById(id);
  }

  // Delete tag (Admin only)
  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }

  // Check if tag exists by name and typeId
  async tagExists(name: string, typeId: number): Promise<boolean> {
    const tag = await this.tagRepository.findOne({
      where: { name, typeId },
    });
    return !!tag;
  }

  // Get tags by names (for content creation validation)
  async getTagsByNames(names: string[], typeId: number): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name IN (:...names)', { names })
      .andWhere('tag.typeId = :typeId', { typeId })
      .getMany();
  }
}

