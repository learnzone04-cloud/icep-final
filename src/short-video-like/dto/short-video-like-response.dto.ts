export class ShortVideoLikeResponseDto {
  action: 'liked' | 'unliked';
  message: string;
  isLiked: boolean;
  likeCount: number;
}
