import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FilterModule } from './filter/filter.module';
import { ResponseService } from './response/response.service';
import { GaurdModule } from './gaurd/gaurd.module';

@Module({
  imports: [DatabaseModule, FilterModule, GaurdModule],
  providers: [ResponseService]
})
export class CommonModule {}
