import { ShortVideoLikeEntity } from './entity/ShortVideoLike';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ShortVideoService } from 'src/short-video/short-video.service';
import { ShortVideoLikeResponseDto } from './dto/short-video-like-response.dto';
export declare class ShortVideoLikeService {
    private shortVideoLikeRepo;
    private readonly userService;
    private readonly shortVideoService;
    constructor(shortVideoLikeRepo: Repository<ShortVideoLikeEntity>, userService: UsersService, shortVideoService: ShortVideoService);
    toggleShortVideoLike(shortVideoId: number, studentId: number): Promise<ShortVideoLikeResponseDto>;
    getShortVideoLikeCount(shortVideoId: number): Promise<number>;
    checkUserLikeStatus(shortVideoId: number, studentId: number): Promise<boolean>;
    find(): Promise<ShortVideoLikeEntity[]>;
    findLikeForShortVideo(id: number): Promise<ShortVideoLikeEntity[]>;
    findOneById(id: number): Promise<ShortVideoLikeEntity>;
    checkUserLike(shortVideoId: number, studentId: number): Promise<{
        isLiked: boolean;
        likeId: number;
    }>;
    delete(id: number): Promise<ShortVideoLikeEntity>;
}
