import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminService } from '../admin/admin.service';
import { SignInDto } from './dto/signInDto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthAdminService {
  constructor(private readonly adminService: AdminService) { }

  async signUp(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminService.create(createAdminDto);

    if (candidate) {
      throw new BadRequestException("Admin already exists")
    }

    const newAdmin = await this.adminService.create(createAdminDto);
    const response = {
      message: "You have successfully registered",
      adminId: newAdmin.id
    };

    return response;
  }

  async singIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;

    const admin = await this.adminService.findByEmail(email);

    if (!admin) {
      throw new BadRequestException("Invalid email or password")
    }

    const matchPass = await bcrypt.compare(password, admin.password);

    if (!matchPass) {
      throw new BadRequestException("Invalid email or password");
    }

    const tokens = await this.adminService.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 11);

    const updatedAdmin = await this.adminService.updateRefreshToken(
      admin.id,
      hashed_refresh_token
    )

    if (!updatedAdmin) {
      throw new BadRequestException("Cannot save token")
    }

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: 1296000000,
      httpOnly: true
    });

    const response = {
      message: "Admin logged in",
      adminId: admin.id,
      access_token: tokens.accessToken
    }

    return response;
  }
}
