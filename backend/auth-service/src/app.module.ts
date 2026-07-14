import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './identity/identity.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [IdentityModule],
})
export class AppModule {}
