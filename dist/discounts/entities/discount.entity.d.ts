import { TeacherEntity } from 'src/teacher/entity/Teacher';
export declare enum DiscountScope {
    ALL_COURSES = "all_courses",
    ALL_ROOMS = "all_rooms",
    COURSE = "course",
    ROOM = "room"
}
export declare class Discount {
    id: number;
    teacherId: number;
    teacher: TeacherEntity;
    scope: DiscountScope;
    targetId?: number;
    percent: number;
    startAt: Date;
    endAt: Date;
    active: boolean;
    createdAt: Date;
}
