import { ReelEntity } from './entity/Reel';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateReelDto } from './dtos/create-reel.dto';
import { UpdateReelDto } from './dtos/update-reel.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RecommendationService } from 'src/recommendation/services/recommendation.service';
export declare class ReelsService {
    private reelRepo;
    private readonly userService;
    private readonly notificationService;
    private readonly recommendationService;
    constructor(reelRepo: Repository<ReelEntity>, userService: UsersService, notificationService: NotificationService, recommendationService: RecommendationService);
    createReel(id: number, data: CreateReelDto, videoFile?: Express.Multer.File): Promise<ReelEntity>;
    private getVideoDuration;
    find(): Promise<ReelEntity[]>;
    findByUserType(user: any): Promise<ReelEntity[]>;
    findReelsWithRecommendations(userId: number, userTypeId: number): Promise<{
        id: number;
        description: string;
        reelPath: string;
        level: string;
        tags: string;
        duration: number;
        typeId: string;
        createdAt: Date;
        user: {
            id: number;
            fName: string;
            lName: string;
            isFollowed: boolean;
        };
        likesCount: number;
        commentsCount: number;
        recommendationScore: any;
        rank: number;
    }[]>;
    findOneById(id: number): Promise<ReelEntity>;
    update(id: number, data: UpdateReelDto): Promise<ReelEntity>;
    delete(id: number, user: any): Promise<ReelEntity>;
}
