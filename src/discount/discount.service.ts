import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Discount } from './models/discount.model';

@Injectable()
export class DiscountService {
  constructor(@InjectModel(Discount) private readonly discountModel: typeof Discount){}
  async create(createDiscountDto: CreateDiscountDto) {
    return await this.discountModel.create(createDiscountDto);
  }

  async findAll() {
    return await this.discountModel.findAll();
  }

  async findOne(id: number) {
    return await this.discountModel.findByPk(id);
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const result = await this.discountModel.update(
      updateDiscountDto,
      {where:{id}, returning: true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.discountModel.destroy({where:{id}});
    return result == 1 ? "Deleted successfully" : "Not found";
  }
}
