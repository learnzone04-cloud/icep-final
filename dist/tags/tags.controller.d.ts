import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    private readonly logger;
    constructor(tagsService: TagsService);
    createTag(createTagDto: CreateTagDto): Promise<{
        success: boolean;
        message: string;
        tag: import("./entities/Tag").Tag;
    }>;
    getAllTags(): Promise<{
        success: boolean;
        tagsByType: {
            [key: string]: import("./entities/Tag").Tag[];
        };
        totalCount: number;
    }>;
    getTagsByType(req: any): Promise<{
        success: boolean;
        tags: import("./entities/Tag").Tag[];
        totalCount: number;
        userId: any;
    }>;
    getTagById(id: string): Promise<{
        success: boolean;
        tag: import("./entities/Tag").Tag;
    }>;
    updateTag(id: string, updateTagDto: UpdateTagDto): Promise<{
        success: boolean;
        message: string;
        tag: import("./entities/Tag").Tag;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        timestamp: Date;
        message: string;
    }>;
}
