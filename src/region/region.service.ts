import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from './models/region.entity';

@Injectable()
export class RegionService {
  constructor(@InjectModel(Region) private readonly regionModel: typeof Region) {}
  async create(createRegionDto: CreateRegionDto) {
    return await this.regionModel.create(createRegionDto);
  }

  async findAll() {
    return await this.regionModel.findAll();
  }

  async findOne(id: number) {
    return await this.regionModel.findByPk(id);
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const result = this.regionModel.update(
      updateRegionDto,
      {where: {id}, returning: true}
    );
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.regionModel.destroy({where: {id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
