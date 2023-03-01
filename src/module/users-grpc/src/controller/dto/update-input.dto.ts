import {ApiProperty} from '@nestjs/swagger';
import {UsersRoleEnum} from '@src-module/users-grpc/src/controller/enum/users-role.enum';

export class UpdateInputDto {
  @ApiProperty({
    description: 'The password of user for login and use on proxy',
    type: String,
    minLength: 5,
    maxLength: 50,
    required: false,
    example: 'my password',
  })
  password: string;

  @ApiProperty({
    description: 'The role of user',
    type: String,
    enum: UsersRoleEnum,
    required: false,
    example: UsersRoleEnum.USER,
  })
  role: UsersRoleEnum;

  @ApiProperty({
    description: 'The name of user',
    type: String,
    minLength: 2,
    maxLength: 50,
    required: false,
    example: 'name',
  })
  name: string;

  @ApiProperty({
    description: 'The age of user',
    type: Number,
    minimum: 18,
    maximum: 300,
    required: false,
    example: 20,
  })
  age: number;
}
