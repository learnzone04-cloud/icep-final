import { ReelCommentEntity } from './entity/ReelComment';
import { UsersService } from 'src/users/users.service';
import { ReelsService } from 'src/reels/reels.service';
import { Repository } from 'typeorm';
export declare class ReelCommentService {
    private reelLikeRepo;
    private readonly userService;
    private readonly reelService;
    constructor(reelLikeRepo: Repository<ReelCommentEntity>, userService: UsersService, reelService: ReelsService);
    createReel(reelId: number, id: number, data: {
        content: string;
    }): Promise<ReelCommentEntity>;
    find(): Promise<ReelCommentEntity[]>;
    findCommentForReel(id: number): Promise<ReelCommentEntity[]>;
    findOneById(id: number): Promise<ReelCommentEntity>;
    delete(id: number): Promise<ReelCommentEntity>;
}
