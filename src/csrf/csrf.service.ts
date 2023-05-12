import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Csrf } from './entities/csrf.entity';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';

@Injectable()
export class CsrfService {
  constructor(
    @InjectModel(Csrf.name) private readonly csrfModel: Model<Csrf>,
  ) {}

  async createToken(userId: string) {
    await this.removeToken(userId);
    const token = randomBytes(12).toString('hex');
    return this.csrfModel.create({ token, userId });
  }

  async verifyToken(token: string, userId: string) {
    const csrf = await this.checkToken(token, userId);
    if (!csrf) {
      throw new UnauthorizedException('You can not make this request');
    }
    await this.removeToken(userId);
  }

  async removeToken(userId: string) {
    return this.csrfModel.deleteMany({ userId });
  }

  async checkToken(token: string, userId: string) {
    const csrf = await this.csrfModel.findOne({ token });
    if (
      !(
        csrf &&
        csrf.token === token &&
        csrf.userId.toString() === userId.toString()
      )
    ) {
      throw new UnauthorizedException("You don't have the token or the UserId");
    } else {
      return csrf;
    }
  }
}
