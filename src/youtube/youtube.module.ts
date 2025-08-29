import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
        imports: [MulterModule.register({
        dest: './uploads', 
    })],
    controllers: [YoutubeController],
    providers: [YoutubeService],
    exports: [YoutubeService]
})
export class YoutubeModule {}