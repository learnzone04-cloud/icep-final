import { Repository } from 'typeorm';
import { Tag } from './entities/Tag';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { TeacherService } from 'src/teacher/teacher.service';
export declare class TagsService {
    private tagRepository;
    private teacherService;
    constructor(tagRepository: Repository<Tag>, teacherService: TeacherService);
    createTag(createTagDto: CreateTagDto): Promise<Tag>;
    getTagsByType(typeId: number): Promise<Tag[]>;
    getTagsByTeacherType(userId: number): Promise<Tag[]>;
    getAllTags(): Promise<Tag[]>;
    getTagsOrderedByType(): Promise<{
        [key: string]: Tag[];
    }>;
    getTagById(id: number): Promise<Tag>;
    updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag>;
    deleteTag(id: number): Promise<void>;
    tagExists(name: string, typeId: number): Promise<boolean>;
    getTagsByNames(names: string[], typeId: number): Promise<Tag[]>;
}
