import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return null;
        }
        delete user.password;
        return user;
      });
    }
    return null;
  }

  async signin(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }
}
