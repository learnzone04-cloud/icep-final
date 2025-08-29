import { Repository } from 'typeorm';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { StudentType } from '../student-type/entity/StudentType';
import { NotificationService } from '../notification/notification.service';
import { DiscountsService } from 'src/discounts/discounts.service';
export declare class ConversationRoomParticipantService {
    private readonly roomRepo;
    private readonly participantRepo;
    private readonly studentTypeRepo;
    private readonly notificationService;
    private readonly discountsService;
    private stripe;
    constructor(roomRepo: Repository<ConversationRoom>, participantRepo: Repository<ConversationRoomParticipant>, studentTypeRepo: Repository<StudentType>, notificationService: NotificationService, discountsService: DiscountsService);
    enrollStudent(roomId: number, studentId: number, paymentMethodId: string, couponCode?: string): Promise<any>;
}
