import { Module } from '@nestjs/common';
import { ResponseService } from './response/response.service';

@Module({
  imports: [],
  providers: [ResponseService],
})
export class CommonModule {}
