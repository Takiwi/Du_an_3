import { Controller, Get } from '@nestjs/common';
import { ApiErrorResponse } from '../../../shared/decorators/apiErrorResponse.decorator';

@ApiErrorResponse('INTERNAL_SERVER_ERROR', {
  description: 'Internal server error',
})
@Controller('user/')
export class UserController {
  @Get('me')
  async userInfo() {}
}
