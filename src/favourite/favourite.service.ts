import { Injectable } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Favourite } from './models/favourite.entity';

@Injectable()
export class FavouriteService {
  constructor(@InjectModel(Favourite) private readonly favouriteModel: typeof Favourite){}
  async create(createFavouriteDto: CreateFavouriteDto) {
    return await this.favouriteModel.create(createFavouriteDto);
  }

  async findAll() {
    return await this.favouriteModel.findAll();
  }

  async findOne(id: number) {
    return await this.favouriteModel.findByPk(id);
  }

  async update(id: number, updateFavouriteDto: UpdateFavouriteDto) {
    const result = await this.favouriteModel.update(
      updateFavouriteDto,
      {where:{id}, returning: true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.favouriteModel.destroy({where:{id}});
    return result == 1 ? "Deleted successfully" : "Not found";
  }
}
