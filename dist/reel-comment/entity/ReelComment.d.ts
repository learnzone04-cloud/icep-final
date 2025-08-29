import { UserEntity } from 'src/users/entity/User';
import { ReelEntity } from 'src/reels/entity/Reel';
export declare class ReelCommentEntity {
    id: number;
    content: string;
    reel: ReelEntity;
    reelId: number;
    student: UserEntity;
    studentId: string;
}
