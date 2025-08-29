import { ReelCommentEntity } from 'src/reel-comment/entity/ReelComment';
import { ReelLikeEntity } from 'src/reel-like/entity/ReelLike';
import { TypeEntity } from 'src/types/entity/Type';
import { UserEntity } from 'src/users/entity/User';
export declare class ReelEntity {
    id: number;
    reelPath: string;
    description: string;
    tags: string;
    level: string;
    duration: number;
    userId: string;
    typeId: string;
    type: TypeEntity;
    user: UserEntity;
    likes: ReelLikeEntity[];
    comments: ReelCommentEntity[];
    createdAt: Date;
}
