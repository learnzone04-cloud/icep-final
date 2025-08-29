import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleLike } from './entity/ArticleLike';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from 'src/article/article.service';
import { ArticleLikeResponseDto } from './dto/article-like-response.dto';

@Injectable()
export class ArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike)
    private articleLikeRepo: Repository<ArticleLike>,
    private readonly userService: UsersService,
    private readonly articleService: ArticleService,
  ) {}

  async toggleArticleLike(articleId: number, userId: number): Promise<ArticleLikeResponseDto> {
    // Check if user and article exist
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const article = await this.articleService.findOneById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if user already liked this article
    const existingLike = await this.articleLikeRepo.findOne({
      where: { articleId, studentId: userId }
    });

    if (existingLike) {
      // User already liked, so remove the like
      await this.articleLikeRepo.remove(existingLike);
      
      return {
        action: 'unliked',
        message: 'Article unliked successfully',
        isLiked: false,
        likeCount: await this.getArticleLikeCount(articleId)
      };
    } else {
      // User hasn't liked, so add the like
      const newLike = this.articleLikeRepo.create({
        articleId,
        studentId: userId
      });
      
      await this.articleLikeRepo.save(newLike);
      
      return {
        action: 'liked',
        message: 'Article liked successfully',
        isLiked: true,
        likeCount: await this.getArticleLikeCount(articleId)
      };
    }
  }

  async getArticleLikeCount(articleId: number): Promise<number> {
    return this.articleLikeRepo.count({
      where: { articleId }
    });
  }

  async checkUserLikeStatus(articleId: number, userId: number): Promise<boolean> {
    const like = await this.articleLikeRepo.findOne({
      where: { articleId, studentId: userId }
    });
    return !!like;
  }

  find() {
    return this.articleLikeRepo.find({ relations: ['student'] });
  }

  findArticleOneLike(id: number) {
    return this.articleLikeRepo.find({
      where: { articleId: id },
      relations: ['student'],
    });
  }

  findOneById(id: number) {
    return this.articleLikeRepo.findOne({
      where: { id: id },
    });
  }

  async delete(id: number) {
    const findArticleLike = await this.findOneById(id);
    if (!findArticleLike) throw new NotFoundException('Article Like Not Found');

    return this.articleLikeRepo.remove(findArticleLike);
  }
}
