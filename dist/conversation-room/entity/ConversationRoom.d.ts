import { PlacementLevel } from '../../placement-test/placement-test.entity';
import { TeacherEntity as Teacher } from '../../teacher/entity/Teacher';
import { ConversationRoomParticipant } from './ConversationRoomParticipant';
import { TypeEntity } from 'src/types/entity/Type';
export declare enum ConversationRoomStatus {
    SCHEDULED = "scheduled",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class ConversationRoom {
    id: number;
    title: string;
    description: string;
    level: PlacementLevel[];
    tags: string;
    price: number;
    currency: string;
    typeId: number;
    startTime: Date;
    endTime: Date;
    maxStudents: number;
    status: ConversationRoomStatus;
    teacherJoinedAt: Date;
    teacher: Teacher;
    participants: ConversationRoomParticipant[];
    type: TypeEntity;
}
