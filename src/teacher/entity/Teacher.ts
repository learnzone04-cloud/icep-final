import { CertificateEntity } from 'src/certificate/entities/certificate.entity';
import { Course } from 'src/course/entities/course.entity';
import { Follower } from 'src/follower/entities/follower.entity';
import { TypeEntity } from 'src/types/entity/Type';
import { UserEntity } from 'src/users/entity/User';
import { ConversationRoom } from '../../conversation-room/entity/ConversationRoom';
import { Story } from '../../story/entity/Story';
import { Rate } from 'src/rate/entities/rate.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Coupon } from 'src/discounts/entities/coupon.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('teachers')
export class TeacherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  facebookUrl: string;

  @Column()
  instagramUrl: string;

  @OneToMany(() => CertificateEntity, (type) => type.teacher)
  certificate: CertificateEntity;

  @Column('text')
  coverLetter: string;

  @Column()
  cv: string;

  @Column()
  userId: number;

  @Column()
  typeId: number;

  @OneToOne(() => UserEntity, (user) => user.teacher)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => TypeEntity, (type) => type.teachers)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @OneToMany(() => Follower, (type) => type.teacher)
  followers: Follower[];

  @OneToMany(() => Course , (type) => type.teacher)
  course : Course[];

  @OneToMany(() => ConversationRoom, room => room.teacher)
  conversationRooms: ConversationRoom[];

  @OneToMany(() => Story, story => story.teacher)
  stories: Story[];

  @OneToMany(() => Rate, (rate) => rate.teacher)
  rates: Rate[];

  @OneToMany(() => Discount, (discount) => discount.teacher)
  discounts: Discount[];

  @OneToMany(() => Coupon, (coupon) => coupon.teacher)
  coupons: Coupon[];

  @CreateDateColumn()
  createdAt: Date;
}
