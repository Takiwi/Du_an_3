import { Global, Module } from "@nestjs/common";
import { ClsService } from "./cls.service";

@Global()
@Module({
  providers: [ClsService],
  exports: [ClsService],
})
export class ClsModule {}
