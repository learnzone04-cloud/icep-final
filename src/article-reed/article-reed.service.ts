import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleRead } from './entity/ArticleReed';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class ArticleReedService {
  constructor(
    @InjectRepository(ArticleRead)
    private articleReadRepo: Repository<ArticleRead>,
    private readonly userService: UsersService,
    private readonly service: ArticleService,
  ) {}

  async createArticleRead(data: { articleId: number; id: number }) {
    const user = await this.userService.findOneById(data.id);
    const article = await this.service.findOneById(data.articleId);
    const articleRead = this.articleReadRepo.create(data);
    articleRead.article = article;
    articleRead.student = user;
    return this.articleReadRepo.save(articleRead);
  }

  findArticleReed(id: number) {
    return this.articleReadRepo.find({
      where: { articleId: id },
      relations: ['student'],
    });
  }

  find() {
    return this.articleReadRepo.find({ relations: ['student'] });
  }

  findOneById(id: number) {
    return this.articleReadRepo.findOne({
      where: { id: id },
    });
  }

  async delete(id: number) {
    const findArticleRead = await this.findOneById(id);
    if (!findArticleRead) throw new NotFoundException('Article Read Not Found');

    return this.articleReadRepo.remove(findArticleRead);
  }
}
