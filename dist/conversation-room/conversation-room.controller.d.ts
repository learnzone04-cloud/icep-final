import { ConversationRoomService } from './conversation-room.service';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipantService } from './conversation-room-participant.service';
import { Request } from 'express';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { Repository } from 'typeorm';
export declare class ConversationRoomController {
    private readonly roomService;
    private readonly participantService;
    private readonly teacherRepo;
    private readonly studentRepo;
    constructor(roomService: ConversationRoomService, participantService: ConversationRoomParticipantService, teacherRepo: Repository<TeacherEntity>, studentRepo: Repository<Student>);
    createRoom(body: Partial<ConversationRoom>, req: Request): Promise<ConversationRoom>;
    enrollStudent(req: Request, body: {
        roomId: number;
        paymentMethodId: string;
        couponCode?: string;
    }): Promise<any>;
    getRoomsByStudentType(req: Request): Promise<ConversationRoom[]>;
    getTeacherActiveRooms(req: Request): Promise<ConversationRoom[]>;
    getRoomStudents(roomId: number, req: Request): Promise<any[]>;
    getStudentEnrolledRooms(req: Request): Promise<ConversationRoom[]>;
}
