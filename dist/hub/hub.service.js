"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hub_message_entity_1 = require("./entities/hub-message.entity");
const Type_1 = require("../types/entity/Type");
const User_1 = require("../users/entity/User");
const profanity_filter_service_1 = require("./profanity-filter.service");
let HubService = class HubService {
    constructor(hubMessageRepository, typeRepository, userRepository, profanity) {
        this.hubMessageRepository = hubMessageRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.profanity = profanity;
    }
    async saveMessage(content, senderId, typeId) {
        try {
            const type = await this.typeRepository.findOneBy({ id: typeId });
            if (!type) {
                throw new common_1.NotFoundException(`Type with ID ${typeId} not found`);
            }
            if (!content || content.trim().length === 0) {
                throw new common_1.BadRequestException('Message content cannot be empty');
            }
            const sender = await this.userRepository.findOneBy({ id: senderId });
            if (!sender) {
                throw new common_1.NotFoundException(`Sender with ID ${senderId} not found`);
            }
            const lang = this.profanity.normalizeLanguage(type.name);
            const { isProfane, result } = this.profanity.sanitize(content.trim(), lang);
            const message = this.hubMessageRepository.create({
                content: result,
                badword: isProfane,
                sender,
                type
            });
            return await this.hubMessageRepository.save(message);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to save message');
        }
    }
    async getMessages(limit = 50, beforeId) {
        try {
            if (limit < 1 || limit > 100) {
                limit = 50;
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
            return messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                timestamp: msg.timestamp,
                type: msg.type,
                fullName: msg.sender ? `${msg.sender.fName} ${msg.sender.lName}` : null,
                role: msg.sender ? msg.sender.role : null,
                badword: msg.badword
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to retrieve messages');
        }
    }
    async getMessageById(id) {
        try {
            const message = await this.hubMessageRepository.findOne({
                where: { id },
                relations: ['type', 'sender']
            });
            if (!message) {
                throw new common_1.NotFoundException(`Message with ID ${id} not found`);
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to retrieve message');
        }
    }
};
exports.HubService = HubService;
exports.HubService = HubService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hub_message_entity_1.HubMessage)),
    __param(1, (0, typeorm_1.InjectRepository)(Type_1.TypeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(User_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        profanity_filter_service_1.ProfanityFilterService])
], HubService);
//# sourceMappingURL=hub.service.js.map