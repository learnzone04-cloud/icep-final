import { UserEntity } from 'src/users/entity/User';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';
export declare class ShortVideoCommentEntity {
    id: number;
    content: string;
    shortVideo: ShortVideoEntity;
    shortVideoId: number;
    student: UserEntity;
    studentId: string;
}
