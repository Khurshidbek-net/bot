import { Injectable } from '@nestjs/common';
import { CreateStoreSocialLinkDto } from './dto/create-store-social-link.dto';
import { UpdateStoreSocialLinkDto } from './dto/update-store-social-link.dto';
import { InjectModel } from '@nestjs/sequelize';
import { StoreSocialLink } from './models/store-social-link.entity';

@Injectable()
export class StoreSocialLinkService {
  constructor(@InjectModel(StoreSocialLink) private readonly socialLinkModel: typeof StoreSocialLink){}
  async create(createStoreSocialLinkDto: CreateStoreSocialLinkDto) {
    return await this.socialLinkModel.create(createStoreSocialLinkDto)
  }

  async findAll() {
    return await this.socialLinkModel.findAll();
  }

  async findOne(id: number) {
    return await this.socialLinkModel.findByPk(id);
  }

  async update(id: number, updateStoreSocialLinkDto: UpdateStoreSocialLinkDto) {
    const result = await this.socialLinkModel.update(
      updateStoreSocialLinkDto,
      {where:{id}, returning: true}
    )
    return result[1][0]
  }

  async remove(id: number) {
    const result = await this.socialLinkModel.destroy({where:{id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
