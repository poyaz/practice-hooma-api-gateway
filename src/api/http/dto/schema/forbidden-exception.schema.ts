import {DefaultExceptionDto} from '@src-api/http/dto/default-exception.dto';
import {ForbiddenException} from '@nestjs/common';
import {getSchemaPath, OmitType} from '@nestjs/swagger';

const forbiddenException = new ForbiddenException();

export const ForbiddenExceptionSchema = {
  allOf: [
    {
      title: forbiddenException.name,
      description: forbiddenException.message,
    },
    {
      $ref: getSchemaPath(DefaultExceptionDto),
    },
    {
      properties: {
        statusCode: {
          example: forbiddenException.getStatus(),
        },
        message: {
          example: forbiddenException.message,
        },
        action: null,
        error: null,
      },
    },
  ],
};
