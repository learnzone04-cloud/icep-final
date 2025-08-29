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
import { TypesService } from './types.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { CreateTypeDto } from './dtos/create-type.dto';
import { UpdateTypeDto } from './dtos/update-type.dto';

@Controller('types')
export class TypesController {
  constructor(private readonly typeService: TypesService) {}

  @UseGuards(AdminAuthGuard)
  @Post('/')
  createType(@Request() req, @Body() body: CreateTypeDto): any {
    return this.typeService.create(body);
  }

  @Get('/')
  get(): any {
    return this.typeService.find();
  }

  @UseGuards(AdminAuthGuard)
  @Delete('/:id')
  deleteType(@Param('id', ParseIntPipe) id: number): any {
    return this.typeService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTypeDto,
  ): any {
    return this.typeService.update(id, body);
  }
}
