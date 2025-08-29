import { ShortVideoEntity } from './entity/ShortVideo';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateShortVideoDto } from './dtos/create-short-video.dto';
import { UpdateShortVideoDto } from './dtos/update-short-video.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RecommendationService } from 'src/recommendation/services/recommendation.service';
export declare class ShortVideoService {
    private shortVideoRepo;
    private readonly userService;
    private readonly notificationService;
    private readonly recommendationService;
    constructor(shortVideoRepo: Repository<ShortVideoEntity>, userService: UsersService, notificationService: NotificationService, recommendationService: RecommendationService);
    createShortVideo(id: number, data: CreateShortVideoDto, videoFile?: Express.Multer.File): Promise<ShortVideoEntity>;
    private getVideoDuration;
    find(): Promise<ShortVideoEntity[]>;
    findByUserType(user: any): Promise<ShortVideoEntity[]>;
    findShortVideosWithRecommendations(userId: number, userTypeId: number): Promise<{
        id: number;
        description: string;
        videoPath: string;
        level: string;
        tags: string;
        duration: number;
        typeId: string;
        createdAt: Date;
        teacher: {
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
    findOneById(id: number): Promise<ShortVideoEntity>;
    update(id: number, data: UpdateShortVideoDto, user: any): Promise<ShortVideoEntity>;
    delete(id: number, user: any): Promise<ShortVideoEntity>;
}
