import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/SignDto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ){}

  async signUp(createUserDto: CreateUserDto){
    const candidate = await this.userService.create(createUserDto);

    if(candidate){
      throw new BadRequestException("User already exists")
    }

    const newUser = await this.userService.create(createUserDto);
    const response = {
      message: "You have successfully registered",
      userId: newUser.id
    };

    return response;
  }

  async signIn(singInDto: SignInDto, res:Response){
    const {email, password} = singInDto;

    const user = await this.userService.findUserByEmail(email);

    if(!user){
      throw new BadRequestException("Invalid email or password")
    }

    if(!user.is_active){
      throw new BadRequestException("User is not active")
    }

    const matchPass = await bcrypt.compare(password, user.hashed_password);

    if(!matchPass){
      throw new BadRequestException("User is not active");
    }

    const tokens = await this.userService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 11);
    const updatedUser = await this.userService.updateRefreshToken(
      user.id,
      hashed_refresh_token
    );

    if(!updatedUser){
      throw new InternalServerErrorException("Cannot save token")
    }

    res.cookie("refresh_token", tokens.refreshToken,{
      maxAge: 1296000000,
      httpOnly: true
    });

    const response = {
      message: "User logged in",
      userId: user.id,
      access_token: tokens.accessToken
    }

    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.refresh_key
    });

    if(!userData){
      throw new ForbiddenException("User not verified")
    }

    const hashed_refresh_token = null;
    await this.userService.updateRefreshToken(
      userData.id,
      hashed_refresh_token
    );

    res.clearCookie("refresh_token");
    const response = {
      message: "User logged out successfully"
    };

    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res:Response){
    const decodedToken = await this.jwtService.decode(refreshToken);

    if(userId != decodedToken["id"]){
      throw new BadRequestException("Not allowed")
    }

    const user = await this.userService.findOne(userId);

    if(!user || !user.hashed_refresh_token){
      throw new BadRequestException("User not found")
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    );

    if(!tokenMatch){
      throw new ForbiddenException("Forbidden");
    }

    const tokens = await this.userService.getTokens(user);


    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 11);
    await this.userService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refresh_token", tokens.refreshToken,{
      maxAge: 1296000000,
      httpOnly: true
    });

    const response = {
      message: "User refreshed",
      user: user.id,
      accessToken: tokens.accessToken
    };

    return response;
  }
}
