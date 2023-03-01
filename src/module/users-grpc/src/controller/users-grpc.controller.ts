import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Headers,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse, ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {DefaultSuccessDto} from '@src-api/http/dto/default-success.dto';
import {UnauthorizedExceptionSchema} from '@src-api/http/dto/schema/unauthorized-exception.schema';
import {ValidateExceptionDto} from '@src-api/http/dto/validate-exception.dto';
import {ClientGrpc} from '@nestjs/microservices';
import {
  CreateRequest,
  UpdateRequest,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@src-module/users-grpc/src/controller/users.pb';
import {ForbiddenExceptionSchema} from '@src-api/http/dto/schema/forbidden-exception.schema';
import {DefaultExceptionDto} from '@src-api/http/dto/default-exception.dto';
import {DefaultArraySuccessDto} from '@src-api/http/dto/default-array-success.dto';
import {FindOneOutputDto} from '@src-module/users-grpc/src/controller/dto/find-one-output.dto';
import {CreateInputDto} from '@src-module/users-grpc/src/controller/dto/create-input.dto';
import {NotFoundExceptionSchema} from '@src-api/http/dto/schema/not-found-exception.schema';
import {Metadata} from '@grpc/grpc-js';
import {AuthRoles} from '@src-api/http/decorator/auth-roles.decorator';
import {UsersRoleEnum} from '@src-module/users-grpc/src/controller/enum/users-role.enum';
import {RolesGuard} from '@src-module/http-auth/src/guard/roles.guard';
import {OwnUserAccessGuard} from '@src-module/users-grpc/src/guard/own-user-access.guard';
import {UserOwnAccess} from '@src-module/users-grpc/src/decorator/user-own-access.decorator';
import {PropertyAccessGuard} from '@src-module/users-grpc/src/guard/property-access.guard';
import {PropertyAccess} from '@src-module/users-grpc/src/decorator/property-access.decorator';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(RolesGuard, OwnUserAccessGuard, PropertyAccessGuard)
@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized access when your login information not valid',
  schema: UnauthorizedExceptionSchema,
})
@ApiUnprocessableEntityResponse({description: 'Unprocessable entity error', type: ValidateExceptionDto})
@ApiForbiddenResponse({
  description: 'Forbidden access when you filled attributes properties which need access to this field',
  schema: ForbiddenExceptionSchema,
})
@ApiBadRequestResponse({description: 'Bad Request', type: DefaultExceptionDto})
@ApiExtraModels(FindOneOutputDto)
export class UsersGrpcController implements OnModuleInit {
  private _svc: UsersServiceClient;

  constructor(
    @Inject(USERS_SERVICE_NAME)
    private readonly _client: ClientGrpc,
  ) {
  }

  onModuleInit(): any {
    this._svc = this._client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  @Get('/')
  @AuthRoles(UsersRoleEnum.ADMIN)
  @ApiOperation({description: 'Get list of users', operationId: 'Get all users'})
  @ApiOkResponse({
    schema: {
      anyOf: [
        {
          allOf: [
            {
              title: 'With data',
            },
            {$ref: getSchemaPath(DefaultArraySuccessDto)},
            {
              properties: {
                count: {
                  type: 'number',
                  example: 1,
                },
                data: {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath(FindOneOutputDto),
                  },
                },
              },
            },
          ],
        },
        {
          allOf: [
            {
              title: 'Without data',
            },
            {$ref: getSchemaPath(DefaultArraySuccessDto)},
            {
              properties: {
                count: {
                  type: 'number',
                  example: 0,
                },
                data: {
                  type: 'array',
                  example: [],
                },
              },
            },
          ],
        },
      ],
    },
  })
  async findAll(@Headers('Authorization') authHeader: string) {
    const metadata = new Metadata();
    metadata.add('Authorization', authHeader);

    return this._svc.findAll({username: '', role: '', name: ''}, metadata);
  }

  @Get('/:userId')
  @UserOwnAccess()
  @AuthRoles(UsersRoleEnum.ADMIN, UsersRoleEnum.USER)
  @ApiOperation({description: 'Get info of one user with ID', operationId: 'Get user'})
  @ApiParam({name: 'userId', type: String, example: '00000000-0000-0000-0000-000000000000'})
  @ApiOkResponse({
    schema: {
      allOf: [
        {$ref: getSchemaPath(DefaultSuccessDto)},
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(FindOneOutputDto),
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({description: 'The user id not found.', schema: NotFoundExceptionSchema})
  async findOne(@Param('userId') userId: string, @Headers('Authorization') authHeader: string) {
    const metadata = new Metadata();
    metadata.add('Authorization', authHeader);

    return this._svc.findOne({userId}, metadata);
  }

  @Post('/')
  @AuthRoles(UsersRoleEnum.ADMIN)
  @ApiOperation({description: 'Create new user in system', operationId: 'Create user'})
  @ApiBody({type: CreateInputDto})
  @ApiOkResponse({
    description: 'The user has been create successfully.',
    schema: {
      allOf: [
        {$ref: getSchemaPath(DefaultSuccessDto)},
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(FindOneOutputDto),
            },
          },
        },
      ],
    },
  })
  async create(@Body() createDto: CreateRequest, @Headers('Authorization') authHeader: string) {
    const metadata = new Metadata();
    metadata.add('Authorization', authHeader);

    return this._svc.create(createDto, metadata);
  }

  @Put('/:userId')
  @AuthRoles(UsersRoleEnum.ADMIN, UsersRoleEnum.USER)
  @PropertyAccess((<keyof UpdateRequest>'role'))
  @UserOwnAccess()
  @ApiOperation({description: 'Update exist user', operationId: 'Update user'})
  @ApiParam({name: 'userId', type: String, example: '00000000-0000-0000-0000-000000000000'})
  @ApiBody({type: CreateInputDto})
  @ApiOkResponse({
    description: 'The user has been update successfully.',
    schema: {
      allOf: [
        {$ref: getSchemaPath(DefaultSuccessDto)},
        {
          properties: {
            data: {
              type: 'number',
              example: 1,
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({description: 'The user id not found.', schema: NotFoundExceptionSchema})
  async update(@Param('userId') userId: string, @Body() updateDto: UpdateRequest, @Headers('Authorization') authHeader: string) {
    const metadata = new Metadata();
    metadata.add('Authorization', authHeader);

    updateDto.userId = userId;

    return this._svc.update(updateDto, metadata);
  }

  @Delete('/:userId')
  @AuthRoles(UsersRoleEnum.ADMIN, UsersRoleEnum.USER)
  @UserOwnAccess()
  @HttpCode(204)
  @ApiOperation({description: 'Delete exist user', operationId: 'Delete user'})
  @ApiParam({name: 'userId', type: String, example: '00000000-0000-0000-0000-000000000000'})
  @ApiNoContentResponse({description: 'The user has been delete successfully.'})
  @ApiNotFoundResponse({description: 'The user id not found.', schema: NotFoundExceptionSchema})
  async delete(@Param('userId') userId: string, @Headers('Authorization') authHeader: string) {
    const metadata = new Metadata();
    metadata.add('Authorization', authHeader);

    return this._svc.delete({userId}, metadata);
  }
}
