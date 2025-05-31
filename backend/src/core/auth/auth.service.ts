import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../database/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('validateUser called with:', { email, password });

    const user = await this.userModel.findOne({ where: { email } });
    console.log('User from DB:', user ? user.toJSON() : user);

    if (!user) {
      console.log('No user found for email:', email);
      return null;
    }

    const userJson = user.toJSON();
    console.log('User password:', userJson.password);
    
    if (!userJson.password) {
      console.error('User found but password is undefined/null!', { user: userJson });
      return null;
    }

    try {
      // Şifre karşılaştırması öncesi hash kontrolü


      const hashedInputPassword = await bcrypt.hash(password, 10);
      const isPasswordValid = await bcrypt.compare(password, userJson.password);
      console.log('Input password:', password);
      console.log('Stored hash:', userJson.password);      
      console.log('hashedInputPassword:', hashedInputPassword);
      console.log('isPasswordValid:', isPasswordValid);


      if (!isPasswordValid) {
        return null;
      }

      const { password: _, ...result } = userJson;
      return result;
    } catch (err) {
      console.error('Error during bcrypt.compare:', err, { 
        inputPassword: password, 
        storedHash: userJson.password 
      });
      throw err;
    }
  }

  async login(user: any) {
    console.log('Login user:', user);
    const payload = { email: user.email, sub: user.id, role: user.role };
    console.log('JWT payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    companyId?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...result } = user.toJSON();
    return result;
  }

  async validateToken(payload: any) {
    console.log('Validate token payload:', payload);
    const user = await this.userModel.findOne({ where: { email: payload.email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
} 