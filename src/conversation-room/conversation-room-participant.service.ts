import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { StudentType } from '../student-type/entity/StudentType';
import { PlacementLevel } from '../placement-test/placement-test.entity';
import Stripe from 'stripe';
import { NotificationService } from '../notification/notification.service';
import { DiscountsService } from 'src/discounts/discounts.service';

@Injectable()
export class ConversationRoomParticipantService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(ConversationRoom)
    private readonly roomRepo: Repository<ConversationRoom>,
    @InjectRepository(ConversationRoomParticipant)
    private readonly participantRepo: Repository<ConversationRoomParticipant>,
    @InjectRepository(StudentType)
    private readonly studentTypeRepo: Repository<StudentType>,
    private readonly notificationService: NotificationService,
    private readonly discountsService: DiscountsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-05-28.basil' });
  }

  async enrollStudent(roomId: number, studentId: number, paymentMethodId: string, couponCode?: string): Promise<any> {
    const room = await this.roomRepo.findOne({ where: { id: roomId }, relations: ['participants'] });
    if (!room) throw new NotFoundException('Room not found');

    // Check if already enrolled
    const already = await this.participantRepo.findOne({ where: { room: { id: roomId }, student: { id: studentId } } });
    if (already) throw new BadRequestException('Student already enrolled');

    // Check if room is full
    const count = await this.participantRepo.count({ where: { room: { id: roomId } } });
    if (count >= room.maxStudents) throw new BadRequestException('Room is full, cannot enroll');

    // Check student levels from StudentType
    const studentTypes = await this.studentTypeRepo.find({ where: { student: { id: studentId } } });
    const studentLevels = studentTypes.map(st => st.level);
    if (!studentLevels.some(level => room.level.includes(level as PlacementLevel))) {
      throw new BadRequestException('Student level is not allowed for this room');
    }

    // Pricing: handle coupon if provided
    let finalPrice = room.price;
    let appliedCoupon = null;
    
    if (couponCode) {
      // Find and validate the coupon for this room
      const coupons = await this.discountsService.getActiveCouponsForRoom(roomId);
      const coupon = coupons.find(c => c.code === couponCode.toUpperCase() && c.scope === 'all_rooms');
      
      if (!coupon) {
        throw new BadRequestException('Invalid coupon code for this room');
      }
      
      // Validate coupon dates
      const now = new Date();
      if (coupon.startAt > now || coupon.endAt < now) {
        throw new BadRequestException('Coupon is not active');
      }
      
      // Validate coupon teacher matches room teacher
      if (coupon.teacherId !== room.teacher.id) {
        throw new BadRequestException('Coupon not valid for this room');
      }
      
      // Apply discount
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

    // Stripe payment logic
    if (room.currency.toLowerCase() !== 'usd') throw new BadRequestException('Room currency must be USD');
    const amount = Math.round(finalPrice * 100); // Stripe expects cents
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
      // Note: We removed reservation tracking, so no need to release
      throw new BadRequestException('Payment was not successful. Please try again or use a different payment method.');
    }

    // Enroll student
    const participant = this.participantRepo.create({ room, student: { id: studentId } as any, paid: true });
    const savedParticipant = await this.participantRepo.save(participant);

    // Note: We removed reservation tracking, so no need to consume
    // In the future, you can add usage tracking here if needed
    
    // Send notifications
    try {
      // Get student and teacher details for notifications
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
        
        // Send notification to teacher about new enrollment
        await this.notificationService.sendRoomEnrollmentNotification(
          roomId,
          room.title,
          studentName,
          roomWithTeacher.teacher.userId
        );
        
        // Send payment success notification to student
        await this.notificationService.sendPaymentSuccessNotification(
          studentWithUser.userId,
          room.price,
          room.title
        );
      }
    } catch (error) {
      console.error('Failed to send enrollment notifications:', error);
    }
    
    return savedParticipant;
  }
} 