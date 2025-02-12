import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './models/review.entity';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review) private readonly reviewModel: typeof Review){}
  async create(createReviewDto: CreateReviewDto) {
    return await this.reviewModel.create(createReviewDto);
  }

  async findAll() {
    return await this.reviewModel.findAll();
  }

  async findOne(id: number) {
    return await this.reviewModel.findByPk(id);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const result = await this.reviewModel.update(
      updateReviewDto,
      {where:{id}, returning: true}
    );
    return result[1][0];
  }

  async remove(id: number) {
    const result = await this.reviewModel.destroy({where:{id}});
    return result == 1 ? "Deleted successfully" : "Not found";
  }
}
