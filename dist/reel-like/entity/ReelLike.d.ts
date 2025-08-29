import { UserEntity } from 'src/users/entity/User';
import { ReelEntity } from 'src/reels/entity/Reel';
export declare class ReelLikeEntity {
    id: number;
    isLiked: boolean;
    reel: ReelEntity;
    reelId: number;
    student: UserEntity;
    studentId: string;
}
