import { Repository } from 'typeorm';
import { HubMessage } from './entities/hub-message.entity';
import { TypeEntity } from '../types/entity/Type';
import { UserEntity } from '../users/entity/User';
import { ProfanityFilterService } from './profanity-filter.service';
export declare class HubService {
    private readonly hubMessageRepository;
    private readonly typeRepository;
    private readonly userRepository;
    private readonly profanity;
    constructor(hubMessageRepository: Repository<HubMessage>, typeRepository: Repository<TypeEntity>, userRepository: Repository<UserEntity>, profanity: ProfanityFilterService);
    saveMessage(content: string, senderId: number, typeId: number): Promise<HubMessage>;
    getMessages(limit?: number, beforeId?: number): Promise<any[]>;
    getMessageById(id: number): Promise<any>;
}
