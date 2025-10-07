import { Module } from '@nestjs/common';
import { MajorService } from './major.service';
import { MajorController } from './major.controller';
import { CoreModule } from '../../core/core.module';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [MajorController],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
