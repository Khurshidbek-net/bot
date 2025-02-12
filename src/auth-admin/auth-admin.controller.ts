import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { SignInDto } from './dto/signInDto';
import { Response } from 'express';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) { }


  @Post('signup')
  async signUp(@Body() adminUserDto: CreateAdminDto) {
    return this.authAdminService.signUp(adminUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authAdminService.singIn(signInDto, res);
  }

}
