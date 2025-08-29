import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateEntity } from './entities/certificate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificateEntity]), CertificateModule],
})
export class CertificateModule {}
