import { Module } from '@nestjs/common';
import { PerformancesController } from './performances.controller';
import { PerformancesService } from './performances.service';

@Module({
  controllers: [PerformancesController],
  providers: [PerformancesService],
  exports: [PerformancesService],
})
export class PerformancesModule {}
