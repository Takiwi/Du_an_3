import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { PrismaService } from './shared/infrastructure/database/prisma.service';
@Module({
  imports: [IdentityModule],
  exports: [PrismaService],
})
export class AppModule {}
