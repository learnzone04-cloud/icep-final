export class ReelLikeResponseDto {
  action: 'liked' | 'unliked';
  message: string;
  isLiked: boolean;
  likeCount: number;
}
