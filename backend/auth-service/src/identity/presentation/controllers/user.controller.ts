import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCommonErrors } from '@shared/decorators/apiCommonErrors.decorator';
import { ApiSuccessResponse } from '@shared/decorators/apiSuccessResponse.decorator';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { ApplyApiErrorsResponse } from '@shared/decorators/applyApiErrorsResponse.decorator';
import { CurrentUser } from '@shared/decorators/currentUser.decorator';
import { JwtPayload } from '@auth/application/ports/IJwtAuthentication.port';
import { MeUseCase } from '@auth/application/useCases/me/me.usecase';
import { unwrapResult } from '@packages/pattern';
import { UserMapper } from '../mappers/user.mapper';

@ApiCommonErrors()
@Controller('user/')
export class UserController {
  constructor(private readonly meUseCase: MeUseCase) {}

  @ApiSuccessResponse({
    status: 200,
    model: UserResponseDto,
    message: 'Get user info successfully',
  })
  @ApplyApiErrorsResponse(['USER_NOT_FOUND', 'VALIDATION_TOKEN_FALSE'])
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async userInfo(@CurrentUser<JwtPayload>() result: JwtPayload) {
    return UserMapper.toResponseDto(
      unwrapResult(await this.meUseCase.execute(result.sub)),
    );
  }
}
