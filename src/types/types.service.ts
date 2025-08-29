import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeEntity } from './entity/Type';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dtos/create-type.dto';
import { UpdateTypeDto } from './dtos/update-type.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TypeEntity) private typeRepo: Repository<TypeEntity>,
  ) {}

  create(data: CreateTypeDto) {
    const type = this.typeRepo.create(data);
    return this.typeRepo.save(type);
  }

  find() {
    return this.typeRepo.find();
  }

  findOneById(id: number) {
    if (!id) {
      return null;
    }
    return this.typeRepo.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    const findType = await this.findOneById(id);
    if (!findType) throw new NotFoundException('Type Not Found');

            try {
      // Check if type is being used by teachers
      const teachersCount = await this.typeRepo
        .createQueryBuilder('type')
        .innerJoin('type.teachers', 'teacher')
        .where('type.id = :id', { id })
        .getCount();

      // Check if type is being used by students
      const studentsCount = await this.typeRepo
        .createQueryBuilder('type')
        .innerJoin('type.studentTypes', 'studentType')
        .where('type.id = :id', { id })
        .getCount();

      if (teachersCount > 0 || studentsCount > 0) {
        throw new BadRequestException(`Cannot delete type. It is being used by ${teachersCount} teachers and ${studentsCount} students.`);
      }

      return this.typeRepo.remove(findType);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Log the actual error for debugging
      console.error('Delete type error:', error);
      throw new BadRequestException('Failed to delete type. It may be in use by other entities.');
    }
  }

  async update(id: number, data: UpdateTypeDto) {
    const findType = await this.findOneById(id);
    if (!findType) throw new NotFoundException('Type Not Found');
    Object.assign(findType, data);
    return this.typeRepo.save(findType);
  }
}
