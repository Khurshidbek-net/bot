import { Injectable } from '@nestjs/common';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SocialLink } from './models/social-link.entity';

@Injectable()
export class SocialLinkService {
  constructor(@InjectModel(SocialLink) private readonly socialLinkModel: typeof SocialLink){}
  async create(createSocialLinkDto: CreateSocialLinkDto) {
    return await this.socialLinkModel.create(createSocialLinkDto);
  }

  async findAll() {
    return await this.socialLinkModel.findAll();
  }

  async findOne(id: number) {
    return await this.socialLinkModel.findByPk(id);
  }

  async update(id: number, updateSocialLinkDto: UpdateSocialLinkDto) {
    const result = this.socialLinkModel.update(
      updateSocialLinkDto,
      {where: {id}, returning: true}
    );
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.socialLinkModel.destroy({where: {id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
