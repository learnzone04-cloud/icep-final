import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedArticle } from './entity/SavedArticle';
import { Student } from '../student/entity/Student';
import { ArticleEntity } from '../article/entity/Article';
import { SaveArticleDto } from './dto/save-article.dto';

@Injectable()
export class SavedArticleService {
  constructor(
    @InjectRepository(SavedArticle)
    private readonly savedArticleRepo: Repository<SavedArticle>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}

  async saveArticle(userId: number, saveArticleDto: SaveArticleDto) {
    // Find the student
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    // Check if article exists
    const article = await this.articleRepo.findOne({ where: { id: saveArticleDto.articleId } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if already saved
    const existing = await this.savedArticleRepo.findOne({
      where: { studentId: student.id, articleId: saveArticleDto.articleId }
    });
    if (existing) {
      throw new BadRequestException('Article already saved');
    }

    // Save the article
    const savedArticle = this.savedArticleRepo.create({
      studentId: student.id,
      articleId: saveArticleDto.articleId,
    });

    return this.savedArticleRepo.save(savedArticle);
  }

  async unsaveArticle(userId: number, articleId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const savedArticle = await this.savedArticleRepo.findOne({
      where: { studentId: student.id, articleId }
    });
    if (!savedArticle) {
      throw new NotFoundException('Saved article not found');
    }

    await this.savedArticleRepo.remove(savedArticle);
    return { message: 'Article removed from saved list' };
  }



  async getSavedArticles(userId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const savedArticles = await this.savedArticleRepo.find({
      where: { studentId: student.id },
      relations: ['article', 'article.user', 'article.type'],
      order: { savedAt: 'DESC' },
    });

    return savedArticles.map(saved => ({
      id: saved.id,
      savedAt: saved.savedAt,
      article: saved.article,
    }));
  }

  async isArticleSaved(userId: number, articleId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) {
      return false;
    }

    const savedArticle = await this.savedArticleRepo.findOne({
      where: { studentId: student.id, articleId }
    });

    return !!savedArticle;
  }
} 