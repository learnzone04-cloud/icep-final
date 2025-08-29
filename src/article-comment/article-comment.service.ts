import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleComment } from './entity/ArticleComment';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class ArticleCommentService {
  constructor(
    @InjectRepository(ArticleComment)
    private articleCommentRepo: Repository<ArticleComment>,
    private readonly userService: UsersService,
    private readonly service: ArticleService,
  ) {}

  async createArticleComment(articleId: number, id: number, data: { content: string }) {
    const user = await this.userService.findOneById(id);
    const article = await this.service.findOneById(articleId);
    const articleComment = this.articleCommentRepo.create(data);
    articleComment.article = article;
    articleComment.student = user;
    return this.articleCommentRepo.save(articleComment);
  }

  find() {
    return this.articleCommentRepo.find({ relations: ['student'] });
  }

  findArticleOneComment(id: number) {
    return this.articleCommentRepo.find({
      where: { articleId: id },
      relations: ['student'],
    });
  }

  findOneById(id: number) {
    return this.articleCommentRepo.findOne({
      where: { id: id },
    });
  }

  async delete(id: number) {
    const findArticleComment = await this.findOneById(id);
    if (!findArticleComment) throw new NotFoundException('Article Comment Not Found');

    return this.articleCommentRepo.remove(findArticleComment);
  }
}
