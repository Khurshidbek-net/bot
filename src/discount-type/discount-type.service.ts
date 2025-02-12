import { Injectable } from '@nestjs/common';
import { CreateDiscountTypeDto } from './dto/create-discount-type.dto';
import { UpdateDiscountTypeDto } from './dto/update-discount-type.dto';
import { InjectModel } from '@nestjs/sequelize';
import { DiscountType } from './models/discount-type.model';

@Injectable()
export class DiscountTypeService {
  constructor(@InjectModel(DiscountType) private readonly discountTypeModel: typeof DiscountType){}
  async create(createDiscountTypeDto: CreateDiscountTypeDto) {
    return await this.discountTypeModel.create(createDiscountTypeDto)
  }

  async findAll() {
    return await this.discountTypeModel.findAll();
  }

  async findOne(id: number) {
    return await this.discountTypeModel.findByPk(id);
  }

  async update(id: number, updateDiscountTypeDto: UpdateDiscountTypeDto) {
    const result = await this.discountTypeModel.update(
      updateDiscountTypeDto,
      {where: {id}, returning: true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.discountTypeModel.destroy({where:{id}});

    if(result == 1) {
      return { message: "Deleted successfully" }
    }
    return { message: "Not found" };
  }
}
