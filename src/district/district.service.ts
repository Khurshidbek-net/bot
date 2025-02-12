import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/sequelize';
import { District } from './models/district.model';

@Injectable()
export class DistrictService {
  constructor(@InjectModel(District) private readonly districtModel: typeof District){}
  async create(createDistrictDto: CreateDistrictDto) {
    return await this.districtModel.create(createDistrictDto);
  }

  async findAll() {
    return await this.districtModel.findAll();
  }

  async findOne(id: number) {
    return await this.districtModel.findByPk(id);
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const result = this.districtModel.update(
      updateDistrictDto,
      {where: {id}, returning: true}
    );

    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.districtModel.destroy({where: {id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
