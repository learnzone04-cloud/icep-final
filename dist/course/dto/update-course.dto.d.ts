import { PlacementLevel } from '../../placement-test/placement-test.entity';
export declare class UpdateCourseDto {
    typeId?: number;
    title?: string;
    description?: string;
    tags?: string;
    duration?: string;
    level?: PlacementLevel;
    price?: number;
    videosNumber?: number;
    examCount?: number;
    passGrade?: number;
    hasPassFailSystem?: boolean;
}
