import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NewWordService } from './new-word.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateNewWordDto } from './dtos/create-word.dto';
import { UpdateNewWordDto } from './dtos/update-word.dto';

@Controller('new-word')
export class NewWordController {
  constructor(private readonly service: NewWordService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  createWord(@Request() req: any, @Body() body: CreateNewWordDto) {
    return this.service.createTeacher(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  get() {
    return this.service.find();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(
    @Request() req: any,
    @Body() body: UpdateNewWordDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
