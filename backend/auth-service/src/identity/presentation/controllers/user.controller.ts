import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiCommonErrors,
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
} from '@packages/api-docs';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { CurrentUser } from '@shared/decorators/currentUser.decorator';
import { JwtPayload } from '@auth/application/ports/IJwtAuthentication.port';
import { MeUseCase } from '@auth/application/useCases/me/me.usecase';
import { UserMapper } from '../mappers/user.mapper';
import { ERROR_DEFINITIONS } from '../configs/error.config';

@ApiCommonErrors()
@Controller('user/')
export class UserController {
  constructor(private readonly meUseCase: MeUseCase) {}

  @ApiSuccessResponse({
    status: 200,
    model: UserResponseDto,
    message: 'Get user info successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
  ])
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async userInfo(@CurrentUser<JwtPayload>() userReq: JwtPayload) {
    const result = await this.meUseCase.execute(userReq.sub);

    if (result.isErr()) throw result.error;

    return UserMapper.toResponseDto(result.value);
  }
}
