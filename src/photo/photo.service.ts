import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from './models/photo.entity';

@Injectable()
export class PhotoService {
  constructor(@InjectModel(Photo) private readonly photoModel: typeof Photo){}
  async create(createPhotoDto: CreatePhotoDto) {
    return await this.photoModel.create(createPhotoDto);
  }

  async findAll() {
    return await this.photoModel.findAll();
  }

  async findOne(id: number) {
    return await this.photoModel.findByPk(id);
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    const result = await this.photoModel.update(
      updatePhotoDto,
      {where:{id}, returning:true}
    )
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.photoModel.destroy({where:{id}})
    return result == 1 ? { message: "Deleted successfully" } : { message: "Not found" }; 
  }
}
