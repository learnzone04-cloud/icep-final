export declare class SingleLessonDto {
    lessonDate: string;
    startTime: string;
    endTime: string;
}
export declare class CreateLessonBatchDto {
    teacherId: number;
    studentId: number;
    chatId?: number;
    lessons: SingleLessonDto[];
    price: number;
}
