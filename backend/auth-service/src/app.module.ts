import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsModule, RequestIdMiddleware } from '@packages/request-context';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLoggerModule } from '@packages/logging';
import appConfig from './config/app.config';
import prismaDatabaseConfig from './config/prismaDatabase.config';
import redisDatabaseConfig from './config/redisDatabase.config';
import jwtConfig from './config/jwt.config';
import cookieConfig from './config/cookie.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './presentation/controllers/authentication.controller';
import { JwksController } from './presentation/controllers/jwks.controller';
import { DATA_HASHER_TOKEN } from './application/ports/IDataHasher.port';
import { CryptoDataHasher } from './infrastructure/services/cryptoDataHasher.service';
import { RT_REPOSITORY_TOKEN } from './domain/repositories/IRefreshToken.repository';
import { RefreshTokenRepository } from './infrastructure/repositories/refreshToken.repository';
import { JWT_AUTHENTICATION_TOKEN } from './application/ports/IJwtAuthentication.port';
import { JwtAuthentication } from './infrastructure/services/jwt.service';
import { PASSWORD_HASHER_TOKEN } from './application/ports/IPasswordHasher.port';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher.service';
import { ACCOUNT_REPOSITORY_TOKEN } from './domain/repositories/IAccount.repository';
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { FAILED_LOGIN_TRACKER_TOKEN } from './domain/ports/failedLoginTracker.interface';
import { RedisFailedLoginTracker } from './infrastructure/services/redisFailedLoginTracker.service';
import { BLACKLIST_TOKEN } from './application/ports/IBlackList.port';
import { BlacklistTokenRepository } from './infrastructure/repositories/blacklistToken.repository';
import { JwksService } from './infrastructure/services/jwks.service';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { LoginUseCase } from './application/useCases/login/login.usecase';
import { LogoutUseCase } from './application/useCases/logout/logout.usecase';
import { RefreshTokenUseCase } from './application/useCases/refreshToken/refreshToken.usecase';
import { RegisterUseCase } from './application/useCases/register/register.usecase';
import { ChangePasswordUseCase } from './application/useCases/changePassword/changePassword.usecase';
import { FormatResponse } from '@presentation/interceptors/formatResponse.interceptor';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { PrismaUnitOfWork } from '@infrastructure/services/prismaUnitOfWork.service';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';
import { TRANSACTION_ROLLBACK_ERROR } from './application/ports/IUnitOfWork.port';
import { RedisService } from '@infrastructure/database/redis.service';
import { RabbitMQModule } from './modules/rabbitMQ.module';
import { GRpcModule } from './modules/gRpc.module';
import { ROLE_REPOSITORY_TOKEN } from '@domain/repositories/IRole.repository';
import { RoleRepository } from '@infrastructure/repositories/role.repository';
import { CreateRoleUseCase } from '@application/useCases/role/createRole.usecase';
import { GetRoleList } from '@application/useCases/role/getRoleList.usecase';
import { UpdateRoleInfoUseCase } from '@application/useCases/role/updateRole.usecase';
import { DeleteRoleUseCase } from '@application/useCases/role/deleteRole.usecase';
import { RoleController } from '@presentation/controllers/role.controller';
import { PermissionController } from '@presentation/controllers/permission.controller';
import { PERMISSION_REPOSITORY_TOKEN } from '@domain/repositories/IPermission.repository';
import { PermissionRepository } from '@infrastructure/repositories/permission.repository';
import { UpdatePermissionUseCase } from '@application/useCases/permission/updatePermission.usecase';
import { DeletePermissionUseCase } from '@application/useCases/permission/deletePermission.usecase';
import { GetPermissionListUseCase } from '@application/useCases/permission/getPermissionList.usecase';
import { CreatePermissionUseCase } from '@application/useCases/permission/createPermission.usecase';
import { CreateAccountSaga } from '@application/sagas/account/createAccount.saga';
import { DeleteAccountUseCase } from '@application/useCases/account/deleteAccount.usecase';
import { AuthExceptionFilter } from '@presentation/filters/authExceptions.filter';
@Module({
  imports: [
    ClsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        prismaDatabaseConfig,
        redisDatabaseConfig,
        jwtConfig,
        cookieConfig,
      ],
    }),
    AppLoggerModule.forRoot('auth-service'),
    PassportModule,
    GRpcModule,
    RabbitMQModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.getOrThrow<string>('JWT_PRIVATE_KEY'),
        publicKey: configService.getOrThrow<string>('JWT_PUBLIC_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthenticationController,
    RoleController,
    PermissionController,
    JwksController,
  ],
  providers: [
    {
      provide: PERMISSION_REPOSITORY_TOKEN,
      useClass: PermissionRepository,
    },
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: RoleRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponse,
    },
    {
      provide: APP_FILTER,
      useClass: ClsModule,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    {
      provide: DATA_HASHER_TOKEN,
      useClass: CryptoDataHasher,
    },
    {
      provide: RT_REPOSITORY_TOKEN,
      useClass: RefreshTokenRepository,
    },
    {
      provide: JWT_AUTHENTICATION_TOKEN,
      useClass: JwtAuthentication,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: AccountRepository,
    },
    {
      provide: FAILED_LOGIN_TRACKER_TOKEN,
      useClass: RedisFailedLoginTracker,
    },
    {
      provide: BLACKLIST_TOKEN,
      useClass: BlacklistTokenRepository,
    },
    {
      provide: TRANSACTION_ROLLBACK_ERROR,
      useClass: PrismaUnitOfWork,
    },
    PrismaService,
    PrismaTransaction,
    RedisService,
    JwksService,
    JwtStrategy,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    RegisterUseCase,
    ChangePasswordUseCase,
    CreateRoleUseCase,
    GetRoleList,
    UpdateRoleInfoUseCase,
    DeleteRoleUseCase,
    CreatePermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    GetPermissionListUseCase,
    CreateAccountSaga,
    DeleteAccountUseCase,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
