import { NewWord } from './entity/NewWord';
import { Repository } from 'typeorm';
import { CreateNewWordDto } from './dtos/create-word.dto';
import { StudentService } from 'src/student/student.service';
import { UpdateNewWordDto } from './dtos/update-word.dto';
export declare class NewWordService {
    private repo;
    private readonly service;
    constructor(repo: Repository<NewWord>, service: StudentService);
    createTeacher(id: number, data: CreateNewWordDto): Promise<NewWord>;
    find(): Promise<NewWord[]>;
    findOneById(id: number): Promise<NewWord>;
    delete(id: number): Promise<NewWord>;
    update(id: number, data: UpdateNewWordDto): Promise<NewWord>;
}
