import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) 
  private readonly adminModel: typeof Admin,
  private readonly jwtService: JwtService
) {}
  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 11);
    createAdminDto.password = hashedPassword;
    return await this.adminModel.create(createAdminDto);
  }

  async findByEmail(email: string) {
    return await this.adminModel.findOne({ where: { email } });
  }

  async findAll() {
    return await this.adminModel.findAll();
  }

  async findOne(id: number) {
    return await this.adminModel.findByPk(id);
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const result = await this.adminModel.update(
      updateAdminDto,
      {where: {id}, returning:true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.adminModel.destroy({where:{id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }

  async getTokens(admin: Admin){
    const payload = {
      id: admin.id,
      is_active: admin.isActive,
      is_creator: admin.isCreator
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.access_key,
        expiresIn: process.env.access_time
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.refresh_key,
        expiresIn: process.env.refresh_time
      })
    ])

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updateAdmin = await this.adminModel.update(
      { hashedRefreshToken: hashed_refresh_token },
      { where: { id } }
    );
    return updateAdmin;
  }
}
