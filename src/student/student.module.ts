import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entity/Student';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentType } from 'src/student-type/entity/StudentType';
import { TypeEntity } from 'src/types/entity/Type';
import { UsersModule } from 'src/users/users.module';
import { TypesModule } from 'src/types/types.module';
import { JwtModule } from '@nestjs/jwt';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Student, StudentType, TypeEntity]),
    forwardRef(() => UsersModule),
    TypesModule,
    forwardRef(() => NotesModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '50000000s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
