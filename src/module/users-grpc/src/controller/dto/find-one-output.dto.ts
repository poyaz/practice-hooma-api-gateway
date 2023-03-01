import {ApiProperty} from '@nestjs/swagger';
import {UsersRoleEnum} from '@src-module/users-grpc/src/controller/enum/users-role.enum';

export class FindOneOutputDto {
  @ApiProperty({
    description: 'The identity of user',
    type: String,
    required: false,
    readOnly: true,
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    description: 'The username of user',
    type: String,
    minLength: 4,
    maxLength: 20,
    pattern: '^[a-zA-Z][a-zA-Z0-9_.-]+$',
    required: false,
    readOnly: true,
    example: 'my-user',
  })
  username: string;

  @ApiProperty({
    description: 'The role of user',
    type: String,
    enum: UsersRoleEnum,
    required: false,
    readOnly: true,
    example: UsersRoleEnum.USER,
  })
  role: UsersRoleEnum;

  @ApiProperty({
    description: 'The name of user',
    type: String,
    minLength: 2,
    maxLength: 50,
    required: false,
    readOnly: true,
    example: 'name',
  })
  name: string;

  @ApiProperty({
    description: 'The age of user',
    type: Number,
    minimum: 18,
    maximum: 300,
    required: false,
    readOnly: true,
    nullable: true,
    example: 20,
  })
  age: number;
}
