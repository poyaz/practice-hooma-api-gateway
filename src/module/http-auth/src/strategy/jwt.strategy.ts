import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtConfigInterface} from '@src-loader/configure/interface/jwt-config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly _configService: ConfigService) {
    const jwtOptions = _configService.get<JwtConfigInterface>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.publicKey,
      algorithms: [jwtOptions.algorithm],
    });
  }

  async validate(payload: any) {
    return {userId: payload.userId, role: payload.role};
  }
}
