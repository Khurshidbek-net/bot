import { Body, Controller, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/SignDto';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookie-getter.decorator';

@ApiTags("AUTH")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService
  ) { }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({summary: "Tizimga kirish"})
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({passthrough: true}) res: Response
  ){
    return this.authService.signIn(signInDto, res)
  }

  @HttpCode(200)
  @Post("signout")
  singout(@CookieGetter("refresh_token") refreshToken: string, @Res({passthrough: true}) res: Response){
    return this.authService.signOut(refreshToken, res);
  }

  @HttpCode(200)
  @Post(":id/refresh")
  refresh(@Param("id") id:number, @CookieGetter("refresh_token") refreshToken: string, @Res({passthrough: true}) res: Response){
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
