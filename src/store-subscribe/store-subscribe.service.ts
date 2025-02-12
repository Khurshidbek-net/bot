import { Injectable } from '@nestjs/common';
import { CreateStoreSubscribeDto } from './dto/create-store-subscribe.dto';
import { UpdateStoreSubscribeDto } from './dto/update-store-subscribe.dto';
import { InjectModel } from '@nestjs/sequelize';
import { StoreSubscribe } from './models/store-subscribe.entity';

@Injectable()
export class StoreSubscribeService {
  constructor(@InjectModel(StoreSubscribe) private readonly storeSubsModel: typeof StoreSubscribe){}
  async create(createStoreSubscribeDto: CreateStoreSubscribeDto) {
    return await this.storeSubsModel.create(createStoreSubscribeDto);
  }

  async findAll() {
    return await this.storeSubsModel.findAll()
  }


  async findOne(id: number) {
    return await this.storeSubsModel.findByPk(id);
  }

  async update(id: number, updateStoreSubscribeDto: UpdateStoreSubscribeDto) {
    const result = await this.storeSubsModel.update(
      updateStoreSubscribeDto,
      {where:{id}, returning: true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.storeSubsModel.destroy({where:{id}})
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" };
  }
}
