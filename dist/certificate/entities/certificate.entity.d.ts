import { TeacherEntity } from '../../teacher/entity/Teacher';
export declare class CertificateEntity {
    id: number;
    certificate: string;
    teacherId: number;
    teacher: TeacherEntity;
}
