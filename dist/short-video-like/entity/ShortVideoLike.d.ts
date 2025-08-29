import { UserEntity } from 'src/users/entity/User';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';
export declare class ShortVideoLikeEntity {
    id: number;
    isLiked: boolean;
    shortVideo: ShortVideoEntity;
    shortVideoId: number;
    student: UserEntity;
    studentId: string;
}
