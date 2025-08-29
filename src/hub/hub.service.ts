import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HubMessage } from './entities/hub-message.entity';
import { TypeEntity } from '../types/entity/Type';
import { UserEntity } from '../users/entity/User';
import { ProfanityFilterService } from './profanity-filter.service';

@Injectable()
export class HubService {
  constructor(
    @InjectRepository(HubMessage)
    private readonly hubMessageRepository: Repository<HubMessage>,
    @InjectRepository(TypeEntity)
    private readonly typeRepository: Repository<TypeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly profanity: ProfanityFilterService,
  ) {}

  async saveMessage(content: string, senderId: number, typeId: number): Promise<HubMessage> {
    try {
      // Validate type exists
      const type = await this.typeRepository.findOneBy({ id: typeId });
      if (!type) {
        throw new NotFoundException(`Type with ID ${typeId} not found`);
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        throw new BadRequestException('Message content cannot be empty');
      }

      // Validate sender exists
      const sender = await this.userRepository.findOneBy({ id: senderId });
      if (!sender) {
        throw new NotFoundException(`Sender with ID ${senderId} not found`);
      }

      // Apply profanity filter
      const lang = this.profanity.normalizeLanguage(type.name);
      const { isProfane, result } = this.profanity.sanitize(content.trim(), lang);

      const message = this.hubMessageRepository.create({ 
        content: result,
        badword: isProfane,
        sender,
        type 
      });
      
      return await this.hubMessageRepository.save(message);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to save message');
    }
  }

  async getMessages(limit = 50, beforeId?: number): Promise<any[]> {
    try {
      // Validate limit
      if (limit < 1 || limit > 100) {
        limit = 50; // Default to 50 if invalid
      }

      const qb = this.hubMessageRepository.createQueryBuilder('msg')
        .leftJoinAndSelect('msg.type', 'type')
        .leftJoinAndSelect('msg.sender', 'sender')
        .orderBy('msg.id', 'DESC')
        .take(limit);
        
      if (beforeId && beforeId > 0) {
        qb.andWhere('msg.id < :beforeId', { beforeId });
      }
      
      const messages = await qb.getMany();
      // Only return id, content, timestamp, type, fullName, role, and badword flag
      return messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        type: msg.type,
        fullName: msg.sender ? `${msg.sender.fName} ${msg.sender.lName}` : null,
        role: msg.sender ? msg.sender.role : null,
        badword: msg.badword
      }));
    } catch (error) {
      throw new BadRequestException('Failed to retrieve messages');
    }
  }

  async getMessageById(id: number): Promise<any> {
    try {
      const message = await this.hubMessageRepository.findOne({
        where: { id },
        relations: ['type', 'sender']
      });
      
      if (!message) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      
      return {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        type: message.type,
        fullName: message.sender ? `${message.sender.fName} ${message.sender.lName}` : null,
        role: message.sender ? message.sender.role : null,
        badword: message.badword
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve message');
    }
  }
}
