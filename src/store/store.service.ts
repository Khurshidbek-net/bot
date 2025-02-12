import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './models/store.entity';
import { where } from 'sequelize';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store) private readonly storeModel: typeof Store){}
  async create(createStoreDto: CreateStoreDto) {
    return await this.storeModel.create(createStoreDto);
  }

  async findAll() {
    return await this.storeModel.findAll();
  }

  async findOne(id: number) {
    return await this.storeModel.findByPk(id);
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const result = await this.storeModel.update(
      updateStoreDto,
      {where: {id}, returning: true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.storeModel.destroy({where:{id}});
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
