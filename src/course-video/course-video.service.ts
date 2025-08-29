import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseVideoEntity } from './entity/course-video.entity';
import { Repository } from 'typeorm';
import { CourseService } from 'src/course/course.service';
import { YoutubeService } from 'src/youtube/youtube.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CourseVideoService {
    constructor (@InjectRepository(CourseVideoEntity) private repo : Repository<CourseVideoEntity>, 
    private courseService: CourseService,
    private youtubeService: YoutubeService) {

    }

    async create(id: number, body: { title: string , description: string}, path: string) {
        const course = await this.courseService.findOne(id);
        
        // Find the highest number for this course and increment by 1
        const lastVideo = await this.repo.findOne({ 
            where: { courseId: id }, 
            order: { number: 'DESC' } 
        });
        const nextNumber = lastVideo ? lastVideo.number + 1 : 1;
        
        const video = this.repo.create(body);
        video.course = course;
        video.number = nextNumber;
        // Remove the line that increments videosNumber - we no longer want to automatically increase it

        video.path = path;
        const tt = await this.repo.save(video);

        return tt;
    }

    findOne(id: number) {
        return this.repo.findOne({ where: {id: id} });
    }

    findAllByCourseId(courseId: number) {
        return this.repo.find({ where: { courseId: courseId} });
    }

    async approveVideo(id: number, youtubeTokens?: any) {
        const videoLocal = await this.findOne(id);
        
        // Check if YouTube tokens are provided
        if (!youtubeTokens) {
            throw new Error('YouTube tokens are required for video approval. Please login as admin with YouTube permissions.');
        }

        // Check if tokens have the required properties
        if (!youtubeTokens.accessToken) {
            throw new Error('Invalid YouTube tokens: accessToken is missing');
        }
        
        // NEW WAY: Use admin's YouTube tokens
        // Temporarily set the tokens for this upload
        const originalTokens = this.youtubeService.tokens;
        this.youtubeService.setTokensAndConfigure(youtubeTokens);
        
        try {
            const video = await this.youtubeService.uploadVideo(videoLocal.title, videoLocal.description, videoLocal.path);
            videoLocal.videoUrl = `https://youtu.be/${video.id}`;
            videoLocal.privacyStatus = video.status.privacyStatus;
            videoLocal.thumbnail_url = video.snippet.thumbnails.medium.url;
            videoLocal.youtubeVideoId = video.id;
            videoLocal.approaved = true;
            fs.unlink(videoLocal.path, (err) => {});
            videoLocal.path = null;
            
            await this.repo.save(videoLocal);
            return video;
        } catch (error) {
            throw new Error(`Failed to upload video to YouTube: ${error.message}`);
        } finally {
            // Restore original tokens
            if (originalTokens) {
                this.youtubeService.setTokensAndConfigure(originalTokens);
            } else {
                this.youtubeService.tokens = null;
                this.youtubeService.oauth2Client.setCredentials({});
            }
        }
    }

    async disapproveVideo(id: number, youtubeTokens?: any) {
        const videoLocal = await this.findOne(id);
        
        if (!videoLocal) {
            throw new Error('Video not found');
        }

        // Check if video was already uploaded to YouTube
        if (videoLocal.youtubeVideoId && videoLocal.approaved) {
            // If video was approved and uploaded to YouTube, we need to delete it from there too
            if (!youtubeTokens) {
                throw new Error('YouTube tokens are required to remove approved videos. Please login as admin with YouTube permissions.');
            }

            if (!youtubeTokens.accessToken) {
                throw new Error('Invalid YouTube tokens: accessToken is missing');
            }
            
            // Use admin's YouTube tokens to delete from YouTube
            const originalTokens = this.youtubeService.tokens;
            this.youtubeService.setTokensAndConfigure(youtubeTokens);
            
            try {
                // Delete video from YouTube
                await this.youtubeService.deleteVideo(videoLocal.youtubeVideoId);
                
                // Delete local file if it exists
                if (videoLocal.path && fs.existsSync(videoLocal.path)) {
                    fs.unlinkSync(videoLocal.path);
                }
                
                // Remove from database
                await this.repo.remove(videoLocal);
                
                return {
                    success: true,
                    message: 'Approved video successfully removed from YouTube and database',
                    deletedVideoId: videoLocal.youtubeVideoId,
                    deletedLocalId: id
                };
            } finally {
                // Restore original tokens
                if (originalTokens) {
                    this.youtubeService.setTokensAndConfigure(originalTokens);
                } else {
                    this.youtubeService.tokens = null;
                    this.youtubeService.oauth2Client.setCredentials({});
                }
            }
        } else {
            // Video was never approved/uploaded to YouTube, just remove locally
            try {
                // Delete local file if it exists
                if (videoLocal.path && fs.existsSync(videoLocal.path)) {
                    fs.unlinkSync(videoLocal.path);
                }
                
                // Remove from database
                await this.repo.remove(videoLocal);
                
                return {
                    success: true,
                    message: 'Unapproved video successfully removed from database and local storage',
                    deletedLocalId: id,
                    wasApproved: false
                };
            } catch (error) {
                throw new Error(`Failed to remove unapproved video: ${error.message}`);
            }
        }
    }

    async editDescreption(id:number , body:{description: string}) {
        const videoLocal = await this.findOne(id);
        videoLocal.description = body.description;
        await this.repo.save(videoLocal);
        return body;

    }

    async delete(id: number) {
        const video = await this.findOne(id);
        if (!video) throw new Error('Course video not found');
        if (video.path) {
            fs.unlink(video.path, (err) => {});
        }
        return this.repo.remove(video);
    }
}
