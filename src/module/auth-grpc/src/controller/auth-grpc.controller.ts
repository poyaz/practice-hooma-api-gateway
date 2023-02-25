import {Body, Controller, HttpCode, Inject, OnModuleInit, Post} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse, ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {DefaultSuccessDto} from '@src-api/http/dto/default-success.dto';
import {UnauthorizedExceptionSchema} from '@src-api/http/dto/schema/unauthorized-exception.schema';
import {ValidateExceptionDto} from '@src-api/http/dto/validate-exception.dto';
import {ExcludeAuth} from '@src-api/http/decorator/exclude-auth.decorator';
import {LoginInputDto} from '@src-module/auth-grpc/src/controller/dto/login-input.dto';
import {AUTH_SERVICE_NAME, AuthServiceClient, LoginRequest} from '@src-module/auth-grpc/src/controller/auth.pb';
import {ClientGrpc} from '@nestjs/microservices';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
@ExcludeAuth()
export class AuthGrpcController implements OnModuleInit {
  private _svc: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME)
    private readonly _client: ClientGrpc,
  ) {
  }

  onModuleInit(): any {
    this._svc = this._client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({description: 'Login user exist in system', operationId: 'Login user'})
  @ApiBody({type: LoginInputDto})
  @ApiOkResponse({
    description: 'The user has been successfully login.',
    schema: {
      allOf: [
        {$ref: getSchemaPath(DefaultSuccessDto)},
        {
          properties: {
            data: {
              type: 'string',
              example: 'JWT token',
            },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access when your login information not valid',
    schema: UnauthorizedExceptionSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable entity error',
    type: ValidateExceptionDto,
  })
  async login(@Body() loginDto: LoginRequest) {
    return this._svc.login(loginDto);
  }
}
