import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category) private readonly categoryModel: typeof Category){}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.findAll();
  }

  async findOne(id: number) {
    return await this.categoryModel.findByPk(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoryModel.update(
      updateCategoryDto,
      {where: {id}, returning:true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.categoryModel.destroy({where:{id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
