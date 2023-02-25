import {ApiResponseProperty} from '@nestjs/swagger';

export class DefaultExceptionDto {
  @ApiResponseProperty({type: Number, example: 400})
  statusCode: number;

  @ApiResponseProperty({type: String, example: 'Error message'})
  message: string;

  @ApiResponseProperty({type: String})
  action?: string;

  @ApiResponseProperty({type: String, example: 'Bad Request'})
  error?: string;
}
