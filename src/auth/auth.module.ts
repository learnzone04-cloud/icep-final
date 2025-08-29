import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from 'src/users/users.module';
import { StudentTypeModule } from 'src/student-type/student-type.module';
import { TypesModule } from 'src/types/types.module';
import { StudentModule } from 'src/student/student.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '50000000s' },
      }),
      inject: [ConfigService],
    }),
    StudentTypeModule,
    TypesModule,
    StudentModule,
    forwardRef(() => TeacherModule),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
