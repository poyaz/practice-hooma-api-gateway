import {ApiProperty, PickType} from '@nestjs/swagger';

export class LoginInputDto {
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
}
