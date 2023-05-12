import { Module } from '@nestjs/common';
import { CsrfService } from './csrf.service';
import { CsrfResolver } from './csrf.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CsrfSchema } from './entities/csrf.entity';

@Module({
  providers: [CsrfResolver, CsrfService],
  imports: [MongooseModule.forFeature([{ name: 'Csrf', schema: CsrfSchema }])],
  exports: [CsrfService],
})
export class CsrfModule {}
