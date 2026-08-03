import { Controller, Get } from '@nestjs/common';
import { ApiErrorResponse } from '../../../shared/decorators/apiErrorResponse.decorator';

@ApiErrorResponse(500, { description: 'Internal server error' })
@Controller('user/')
export class UserController {
  @Get('me')
  async userInfo() {}
}
