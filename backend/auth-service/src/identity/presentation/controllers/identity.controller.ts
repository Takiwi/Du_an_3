import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';
import { UserAlreadyExistsException } from 'src/identity/domain/exceptions/AuthException';

@Controller('auth/')
export class IdentityController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.registerUseCase.execute(createUserDto);

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      // Controller đóng vai trò dịch lỗi Domain thành HTTP Status
      if (error instanceof UserAlreadyExistsException) {
        throw new BadRequestException(error.message); // Trả về HTTP 400
      }
    }
  }
}
