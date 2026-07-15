import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { PrismaService } from './prisma.service';
@Module({
  imports: [IdentityModule],
  exports: [PrismaService],
})
export class AppModule {}
