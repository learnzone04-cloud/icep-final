import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/Article';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RecommendationService } from 'src/recommendation/services/recommendation.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly recommendationService: RecommendationService,
  ) {}

  async createArticle(id: number, data: CreateArticleDto) {
    console.log('📝 createArticle called with id:', id, 'data:', data);
    
    const user = await this.userService.findOneById(id);
    console.log('👤 User found:', { 
      id: user?.id, 
      role: user?.role, 
      hasTeacher: !!user?.teacher,
      teacherId: user?.teacher?.id 
    });
    
    // Check if user is a teacher and has teacher data
    if (!user.teacher) {
      console.log('❌ User has no teacher record');
      throw new NotFoundException('Only teachers can create articles');
    }
    
    if (!user.teacher.type) {
      console.log('❌ Teacher has no type assigned');
      throw new NotFoundException('Teacher must have a type assigned');
    }
    
    const article = this.articleRepo.create(data);
    article.type = user.teacher.type;
    article.user = user;
    
    const savedArticle = await this.articleRepo.save(article);
    console.log('💾 Article saved with ID:', savedArticle.id);
    
    // Send notification to followers
    try {
      console.log('🔔 Attempting to send notification...');
      const teacherName = `${user.fName} ${user.lName}`;
      console.log('👨‍🏫 Teacher name:', teacherName, 'Teacher ID:', user.teacher.id);
      
      await this.notificationService.sendArticleCreatedNotification(
        user.teacher.id,
        teacherName,
        savedArticle.id,
        savedArticle.article
      );
      console.log('✅ Notification sent successfully');
    } catch (error) {
      console.error('❌ Failed to send article notification:', error);
      // Don't fail the article creation if notification fails
    }
    
    return savedArticle;
  }

  find() {
    return this.articleRepo.find({
      relations: [
        'user',
        'articleLikes',
        'articleLikes.student',
        'articleComments',
        'articleComments.student',
        'articleReads',
        'articleReads.student',
      ],
    });
  }

  async findByUserType(user: any) {
    console.log('User from JWT:', user);
    console.log('User role:', user.role);
    console.log('User typeId:', user.typeId);
    
    // If user is a student, filter by their type
    if (user.role === 'Student' && user.typeId) {
      console.log('Filtering for student with typeId:', user.typeId);
      const articles = await this.articleRepo.find({
        where: { typeId: user.typeId },
        relations: [
          'user',
          'articleLikes',
          'articleLikes.student',
          'articleComments',
          'articleComments.student',
          'articleReads',
          'articleReads.student',
        ],
      });
      console.log('Found articles:', articles.map(a => ({ id: a.id, typeId: a.typeId })));
      return articles;
    }
    
    // If user is a teacher, return only their articles
    if (user.role === 'Teacher') {
      console.log('Filtering for teacher with userId:', user.id);
      const articles = await this.articleRepo.find({
        where: { userId: user.id },
        relations: [
          'user',
          'articleLikes',
          'articleLikes.student',
          'articleComments',
          'articleComments.student',
          'articleReads',
          'articleReads.student',
        ],
      });
      console.log('Found teacher articles:', articles.map(a => ({ id: a.id, userId: a.userId })));
      return articles;
    }
    
    // If no role or other cases, return empty array
    console.log('No valid role found, returning empty array');
    return [];
  }

  // New method: Get articles with recommendation scoring for students
  async findArticlesWithRecommendations(userId: number, userTypeId: number) {
    // Get all available articles for the user's type
    const user = await this.userService.findOneById(userId);
    
    if (!user || user.role !== 'Student') {
      throw new NotFoundException('Student not found');
    }

    // Use typeId from JWT token (passed as parameter) instead of querying database
    // This ensures we use the exact type the student is currently authenticated for
    if (!userTypeId) {
      throw new NotFoundException('User type ID is required');
    }
    
    const typeId = userTypeId;

    // Get articles filtered by user type - THIS IS CRUCIAL!
    const articles = await this.articleRepo.find({
      where: { typeId: typeId },
      relations: [
        'user',
        'articleLikes',
        'articleLikes.student',
        'articleComments',
        'articleComments.student',
        'articleReads',
        'articleReads.student',
      ],
    });

    // Get user's recommendation scores for these articles (no limit - get all)
    const recommendations = await this.recommendationService.getRecommendations(userId, 'article', 1000); // Large number to get all
    
    // Create a map of contentId to recommendation score
    const recommendationMap = new Map();
    recommendations.forEach(rec => {
      recommendationMap.set(rec.contentId, rec.score);
    });

    // Add recommendation scores to articles and sort by score (highest first)
    const articlesWithScores = articles.map(article => {
      const recommendationScore = recommendationMap.get(article.id) || 0.5; // Default score if no recommendation
      
      return {
        id: article.id,
        article: article.article,
        level: article.level,
        tags: article.tags,
        userId: article.userId,
        typeId: article.typeId,
        createdAt: article.createdAt,
        // Teacher information
        user: article.user,
        // Engagement metrics
        articleLikes: article.articleLikes,
        articleComments: article.articleComments,
        articleReads: article.articleReads,
        // Recommendation scoring
        recommendationScore: recommendationScore,
        rank: recommendationMap.has(article.id) ? recommendations.find(r => r.contentId === article.id)?.rank || 999 : 999,
      };
    });

    // Sort by recommendation score (highest first), then by creation date (newest first)
    articlesWithScores.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Return ALL articles (no limit)
    return articlesWithScores;
  }

  findOneById(id: number) {
    return this.articleRepo.findOne({
      where: { id: id },
    });
  }

  async delete(id: number) {
    const findArticle = await this.findOneById(id);
    if (!findArticle) throw new NotFoundException('Article Not Found');

    return this.articleRepo.remove(findArticle);
  }

  async update(id: number, data: UpdateArticleDto) {
    const article = await this.findOneById(id);
    
    if (!article) throw new NotFoundException('Article Not Found');
    Object.assign(article, data);
    return this.articleRepo.save(article);
  }
}
