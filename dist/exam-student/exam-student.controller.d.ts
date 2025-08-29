import { ExamStudentService } from './exam-student.service';
export declare class ExamStudentController {
    private readonly examStudentService;
    constructor(examStudentService: ExamStudentService);
    setMark(examId: number, mark: number, req: any): Promise<{
        message: string;
        examStudent?: undefined;
    } | {
        message: string;
        examStudent: import("./exam-student.entity").ExamStudent;
    }>;
}
