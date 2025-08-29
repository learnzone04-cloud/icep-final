import { TeacherEntity } from 'src/teacher/entity/Teacher';
export declare enum CouponMode {
    PUBLIC = "public"
}
export declare enum CouponScope {
    ALL_COURSES = "all_courses",
    ALL_ROOMS = "all_rooms",
    COURSE = "course",
    ROOM = "room"
}
export declare class Coupon {
    id: number;
    teacherId: number;
    teacher: TeacherEntity;
    mode: CouponMode;
    scope: CouponScope;
    targetId?: number;
    percent: number;
    startAt: Date;
    endAt: Date;
    limitTotal: number;
    limitPerStudent: number;
    active: boolean;
    code?: string;
    createdAt: Date;
}
