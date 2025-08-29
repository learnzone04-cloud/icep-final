import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewWord } from './entity/NewWord';
import { Repository } from 'typeorm';
import { CreateNewWordDto } from './dtos/create-word.dto';
import { StudentService } from 'src/student/student.service';
import { UpdateNewWordDto } from './dtos/update-word.dto';

@Injectable()
export class NewWordService {
  constructor(
    @InjectRepository(NewWord)
    private repo: Repository<NewWord>,
    private readonly service: StudentService,
  ) {}

  async createTeacher(id: number, data: CreateNewWordDto) {
    const user = await this.service.findOneByUserId(id);
    const teacher = this.repo.create(data);
    teacher.student = user;
    return this.repo.save(teacher);
  }

  find() {
    return this.repo.find();
  }

  findOneById(id: number) {
    return this.repo.findOne({
      where: { id: id },
      relations: ['student'],
    });
  }

  async delete(id: number) {
    const findTeacher = await this.findOneById(id);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');

    return this.repo.remove(findTeacher);
  }

  async update(id: number, data: UpdateNewWordDto) {
    const findTeacher = await this.findOneById(id);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');
    Object.assign(findTeacher, data);
    return this.repo.save(findTeacher);
  }
}
