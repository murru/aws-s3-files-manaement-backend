import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async create(userObject: RegisterAuthDto) {
    const { password } = userObject;
    const plainToHash = await hash(password, 10);
    userObject = { ...userObject, password: plainToHash };
    return this.userModel.create(userObject);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('USER_NOT_FOUND', 404);
    const checkPsswd = await compare(password, user.password);
    if (!checkPsswd) throw new HttpException('FORBIDDEN', 403);
    const payload = { id: user._id.toString(), name: user.fullname };
    const token = this.jwtService.sign(payload);
    const data = {
      user,
      token
    };
    return data;
  }
}
