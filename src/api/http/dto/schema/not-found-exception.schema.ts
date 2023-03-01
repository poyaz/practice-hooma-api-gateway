import {DefaultExceptionDto} from '@src-api/http/dto/default-exception.dto';
import {ForbiddenException, NotFoundException} from '@nestjs/common';
import {getSchemaPath, OmitType} from '@nestjs/swagger';

const notFoundException = new NotFoundException();

export const NotFoundExceptionSchema = {
  allOf: [
    {
      title: notFoundException.name,
      description: notFoundException.message,
    },
    {
      $ref: getSchemaPath(DefaultExceptionDto),
    },
    {
      properties: {
        statusCode: {
          example: notFoundException.getStatus(),
        },
        message: {
          example: notFoundException.message,
        },
        action: null,
        error: null,
      },
    },
  ],
};
