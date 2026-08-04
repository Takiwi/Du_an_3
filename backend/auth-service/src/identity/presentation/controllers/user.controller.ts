import { Controller, Get } from '@nestjs/common';
import { ApiCommonErrors } from '../../../shared/decorators/apiCommonErrors.decorator';

@ApiCommonErrors()
@Controller('user/')
export class UserController {
  @Get('me')
  async userInfo() {}
}
