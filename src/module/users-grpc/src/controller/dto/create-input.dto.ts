import {ApiProperty} from '@nestjs/swagger';
import {UsersRoleEnum} from '@src-module/users-grpc/src/controller/enum/users-role.enum';

export class CreateInputDto {
  @ApiProperty({
    description: 'The username of user for login and use on proxy',
    type: String,
    minLength: 4,
    maxLength: 20,
    pattern: '^[a-zA-Z][a-zA-Z0-9_.-]+$',
    required: true,
    example: 'my-user',
  })
  username: string;

  @ApiProperty({
    description: 'The password of user for login and use on proxy',
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true,
    example: 'my password',
  })
  password: string;

  @ApiProperty({
    description: 'The role of user',
    type: String,
    enum: UsersRoleEnum,
    required: true,
    example: UsersRoleEnum.USER,
  })
  role: UsersRoleEnum;

  @ApiProperty({
    description: 'The name of user',
    type: String,
    minLength: 2,
    maxLength: 50,
    required: true,
    example: 'name',
  })
  name: string;

  @ApiProperty({
    description: 'The age of user',
    type: Number,
    minimum: 18,
    maximum: 300,
    required: false,
    nullable: true,
    example: 20,
  })
  age: number;
}
