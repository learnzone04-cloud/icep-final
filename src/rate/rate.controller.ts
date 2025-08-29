import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRateDto: CreateRateDto, @Req() req) {
    return this.rateService.create(createRateDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.rateService.findAll();
  }

  @Get('teacher/:teacherId')
  findByTeacherId(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.rateService.findByTeacherId(teacherId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rateService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRateDto: UpdateRateDto, @Req() req) {
    return this.rateService.update(id, updateRateDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.rateService.remove(id, req.user.id);
  }
}
