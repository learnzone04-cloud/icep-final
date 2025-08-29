import { ReelLikeEntity } from './entity/ReelLike';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ReelsService } from 'src/reels/reels.service';
import { ReelLikeResponseDto } from './dto/reel-like-response.dto';
export declare class ReelLikeService {
    private reelLikeRepo;
    private readonly userService;
    private readonly reelService;
    constructor(reelLikeRepo: Repository<ReelLikeEntity>, userService: UsersService, reelService: ReelsService);
    toggleReelLike(reelId: number, userId: number): Promise<ReelLikeResponseDto>;
    getReelLikeCount(reelId: number): Promise<number>;
    checkUserLikeStatus(reelId: number, userId: number): Promise<boolean>;
    find(): Promise<ReelLikeEntity[]>;
    findLikeForReel(id: number): Promise<ReelLikeEntity[]>;
    findOneById(id: number): Promise<ReelLikeEntity>;
    delete(id: number): Promise<ReelLikeEntity>;
}
