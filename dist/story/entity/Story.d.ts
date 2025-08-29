import { TeacherEntity } from '../../teacher/entity/Teacher';
export declare class Story {
    id: number;
    teacherId: number;
    content: string;
    mediaUrl: string;
    isExpired: boolean;
    createdAt: Date;
    expiresAt: Date;
    teacher: TeacherEntity;
    likes: any[];
    get isExpiredNow(): boolean;
}
