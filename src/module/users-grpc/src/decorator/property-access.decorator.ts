import {SetMetadata} from '@nestjs/common';

export const PropertyAccess = (...keys: string[]) => SetMetadata('propertyAccess', keys);
