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
exports.ConversationRoomParticipantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ConversationRoom_1 = require("./entity/ConversationRoom");
const ConversationRoomParticipant_1 = require("./entity/ConversationRoomParticipant");
const StudentType_1 = require("../student-type/entity/StudentType");
const stripe_1 = require("stripe");
const notification_service_1 = require("../notification/notification.service");
const discounts_service_1 = require("../discounts/discounts.service");
let ConversationRoomParticipantService = class ConversationRoomParticipantService {
    constructor(roomRepo, participantRepo, studentTypeRepo, notificationService, discountsService) {
        this.roomRepo = roomRepo;
        this.participantRepo = participantRepo;
        this.studentTypeRepo = studentTypeRepo;
        this.notificationService = notificationService;
        this.discountsService = discountsService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-05-28.basil' });
    }
    async enrollStudent(roomId, studentId, paymentMethodId, couponCode) {
        const room = await this.roomRepo.findOne({ where: { id: roomId }, relations: ['participants'] });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        const already = await this.participantRepo.findOne({ where: { room: { id: roomId }, student: { id: studentId } } });
        if (already)
            throw new common_1.BadRequestException('Student already enrolled');
        const count = await this.participantRepo.count({ where: { room: { id: roomId } } });
        if (count >= room.maxStudents)
            throw new common_1.BadRequestException('Room is full, cannot enroll');
        const studentTypes = await this.studentTypeRepo.find({ where: { student: { id: studentId } } });
        const studentLevels = studentTypes.map(st => st.level);
        if (!studentLevels.some(level => room.level.includes(level))) {
            throw new common_1.BadRequestException('Student level is not allowed for this room');
        }
        let finalPrice = room.price;
        let appliedCoupon = null;
        if (couponCode) {
            const coupons = await this.discountsService.getActiveCouponsForRoom(roomId);
            const coupon = coupons.find(c => c.code === couponCode.toUpperCase() && c.scope === 'all_rooms');
            if (!coupon) {
                throw new common_1.BadRequestException('Invalid coupon code for this room');
            }
            const now = new Date();
            if (coupon.startAt > now || coupon.endAt < now) {
                throw new common_1.BadRequestException('Coupon is not active');
            }
            if (coupon.teacherId !== room.teacher.id) {
                throw new common_1.BadRequestException('Coupon not valid for this room');
            }
            const discountAmount = (room.price * coupon.percent) / 100;
            finalPrice = Math.max(0, room.price - discountAmount);
            appliedCoupon = {
                code: coupon.code,
                percent: coupon.percent,
                originalPrice: room.price,
                discountedPrice: finalPrice,
                discountAmount: discountAmount
            };
        }
        if (room.currency.toLowerCase() !== 'usd')
            throw new common_1.BadRequestException('Room currency must be USD');
        const amount = Math.round(finalPrice * 100);
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            metadata: { studentId: String(studentId), roomId: String(roomId) },
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });
        if (paymentIntent.status !== 'succeeded') {
            throw new common_1.BadRequestException('Payment was not successful. Please try again or use a different payment method.');
        }
        const participant = this.participantRepo.create({ room, student: { id: studentId }, paid: true });
        const savedParticipant = await this.participantRepo.save(participant);
        try {
            const studentWithUser = await this.participantRepo.manager
                .createQueryBuilder()
                .select('s.*, u.fName, u.lName, u.id as userId')
                .from('students', 's')
                .innerJoin('users', 'u', 'u.id = s.userId')
                .where('s.id = :studentId', { studentId })
                .getRawOne();
            const roomWithTeacher = await this.roomRepo
                .createQueryBuilder('room')
                .leftJoinAndSelect('room.teacher', 'teacher')
                .leftJoinAndSelect('teacher.user', 'user')
                .where('room.id = :roomId', { roomId })
                .getOne();
            if (studentWithUser && roomWithTeacher) {
                const studentName = `${studentWithUser.fName} ${studentWithUser.lName}`;
                await this.notificationService.sendRoomEnrollmentNotification(roomId, room.title, studentName, roomWithTeacher.teacher.id);
                await this.notificationService.sendPaymentSuccessNotification(studentId, room.price, room.title);
            }
        }
        catch (error) {
            console.error('Failed to send enrollment notifications:', error);
        }
        return savedParticipant;
    }
};
exports.ConversationRoomParticipantService = ConversationRoomParticipantService;
exports.ConversationRoomParticipantService = ConversationRoomParticipantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ConversationRoom_1.ConversationRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(ConversationRoomParticipant_1.ConversationRoomParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(StudentType_1.StudentType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        discounts_service_1.DiscountsService])
], ConversationRoomParticipantService);
//# sourceMappingURL=conversation-room-participant.service.js.map