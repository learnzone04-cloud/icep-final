import { FollowerService } from './follower.service';
export declare class FollowerController {
    private readonly followerService;
    constructor(followerService: FollowerService);
    create(req: any, teacherId: number): Promise<import("./entities/follower.entity").Follower>;
    findMyFollowers(req: any): Promise<import("./entities/follower.entity").Follower[]>;
    unfollowTeacher(req: any, teacherId: number): Promise<import("./entities/follower.entity").Follower>;
    removeFollower(req: any, studentId: number): Promise<import("./entities/follower.entity").Follower>;
    toggleFollow(req: any, teacherId: number): Promise<{
        message: string;
        isFollowing: boolean;
        action: string;
    }>;
}
