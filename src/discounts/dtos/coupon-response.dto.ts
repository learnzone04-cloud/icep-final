export class CouponResponseDto {
  id: number;
  teacherId: number;
  teacher: {
    id: number;
    user: {
      fName: string;
      lName: string;
    };
  };
  mode: string;
  scope: string;
  targetId?: number;
  percent: number;
  startAt: Date;
  endAt: Date;
  limitTotal: number;
  limitPerStudent: number;
  active: boolean;
  code?: string;
  createdAt: Date;
}
