import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

const commonConfig = config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: commonConfig.parsed.SECRET,
    });
  }

  async validate(payload: any) {
    // console.log('jwt validate payload : ', payload);
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
