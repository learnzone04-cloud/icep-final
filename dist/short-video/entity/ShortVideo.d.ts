import { ShortVideoCommentEntity } from 'src/short-video-comment/entity/ShortVideoComment';
import { ShortVideoLikeEntity } from 'src/short-video-like/entity/ShortVideoLike';
import { TypeEntity } from 'src/types/entity/Type';
import { UserEntity } from 'src/users/entity/User';
export declare class ShortVideoEntity {
    id: number;
    videoPath: string;
    description: string;
    tags: string;
    level: string;
    duration: number;
    teacherId: string;
    typeId: string;
    type: TypeEntity;
    teacher: UserEntity;
    likes: ShortVideoLikeEntity[];
    comments: ShortVideoCommentEntity[];
    createdAt: Date;
}
