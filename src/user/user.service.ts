import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import { MailService } from '../mail/mail.service';
import { FindUserDto } from './dto/find-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(User)
  private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) { }

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner
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

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Confirm password mismatch")
    }

    const activation_link = uuid.v4();
    const hashed_password = bcrypt.hashSync(createUserDto.password, 11);
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      activation_link
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error occured while sending mail")
    }

    return newUser;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found")
    }

    const updatedUser = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false
        },
        returning: true
      }
    );

    if (!updatedUser[1][0]) {
      throw new BadRequestException("User already active")
    }

    const response = {
      message: "User activated successfully",
      user: updatedUser[1][0]
    };

    return response;
  }

  async findAll() {
    return await this.userModel.findAll();
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updateUser = await this.userModel.update(
      { hashed_refresh_token },
      { where: { id } }
    );

    return updateUser;
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } })
  }

  async findOne(id: number) {
    return await this.userModel.findByPk(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUser(findUserDto: FindUserDto){
    const where = {};

    const {name, email, phone} = findUserDto;

    if(name){
      where['name'] = {
        [Op.iLike]: `%${name}%`
      }
    }

    if (email) {
      where['email'] = {
        [Op.iLike]: `%${email}%`
      }
    }

    if (phone) {
      where['phone'] = {
        [Op.iLike]: `%${phone}%`
      }
    }

    console.log(where);

    const users = await this.userModel.findAll({where})
    
    if(users.length == 0){
      throw new NotFoundException("User not found")
    }

    return users;
  }
}
