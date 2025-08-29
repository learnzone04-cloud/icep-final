import { ConversationRoom } from './ConversationRoom';
import { Student } from '../../student/entity/Student';
export declare class ConversationRoomParticipant {
    id: number;
    room: ConversationRoom;
    student: Student;
    paid: boolean;
    joinedAt: Date;
}
