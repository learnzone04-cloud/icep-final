import { ShortVideoCommentEntity } from './entity/ShortVideoComment';
import { UsersService } from 'src/users/users.service';
import { ShortVideoService } from 'src/short-video/short-video.service';
import { Repository } from 'typeorm';
export declare class ShortVideoCommentService {
    private shortVideoCommentRepo;
    private readonly userService;
    private readonly shortVideoService;
    constructor(shortVideoCommentRepo: Repository<ShortVideoCommentEntity>, userService: UsersService, shortVideoService: ShortVideoService);
    createShortVideoComment(shortVideoId: number, id: number, data: {
        content: string;
    }): Promise<ShortVideoCommentEntity>;
    find(): Promise<ShortVideoCommentEntity[]>;
    findCommentForShortVideo(id: number): Promise<ShortVideoCommentEntity[]>;
    findOneById(id: number): Promise<ShortVideoCommentEntity>;
    delete(id: number, user: any): Promise<ShortVideoCommentEntity>;
}
