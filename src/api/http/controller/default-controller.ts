import {ApiExtraModels} from '@nestjs/swagger';
import {DefaultSuccessDto} from '@src-api/http/dto/default-success.dto';
import {DefaultExceptionDto} from '@src-api/http/dto/default-exception.dto';
import {Controller} from '@nestjs/common';
import {DefaultArraySuccessDto} from '@src-api/http/dto/default-array-success.dto';
import {NoBodySuccessDto} from '@src-api/http/dto/no-body-success.dto';
import {ValidateExceptionDto} from '@src-api/http/dto/validate-exception.dto';

@Controller()
@ApiExtraModels(DefaultArraySuccessDto, DefaultExceptionDto, DefaultSuccessDto, NoBodySuccessDto, ValidateExceptionDto)
export class DefaultController {
}
