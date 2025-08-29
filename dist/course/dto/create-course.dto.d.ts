import { PlacementLevel } from '../../placement-test/placement-test.entity';
export declare class CreateCourseDto {
    teacherId: number;
    typeId: number;
    title: string;
    description: string;
    tags: string;
    duration: string;
    level?: PlacementLevel;
    hasPassFailSystem?: boolean;
    price: number;
    passGrade?: number;
    videosNumber?: number;
}
