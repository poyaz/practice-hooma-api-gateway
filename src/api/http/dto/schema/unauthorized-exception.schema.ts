import {DefaultExceptionDto} from '@src-api/http/dto/default-exception.dto';
import {UnauthorizedException} from '@nestjs/common';
import {getSchemaPath, OmitType} from '@nestjs/swagger';

const unauthorizedException = new UnauthorizedException();

export const UnauthorizedExceptionSchema = {
  allOf: [
    {
      title: unauthorizedException.name,
      description: unauthorizedException.message,
    },
    {
      $ref: getSchemaPath(DefaultExceptionDto),
    },
    {
      properties: {
        statusCode: {
          example: unauthorizedException.getStatus(),
        },
        message: {
          example: unauthorizedException.message,
        },
        action: null,
        error: null,
      },
    },
  ],
};
