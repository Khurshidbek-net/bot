import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";
import { DataTypes } from "sequelize";
import { User } from "../../user/models/user.model";

interface IReviewCreationAttr {
  discountId: number;
  userId: number;
  text: string;
  rating: number;
  photo: string;
}


@Table({tableName: 'review'})
export class Review extends Model<Review, IReviewCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => Discount)
  @Column({
    type: DataTypes.INTEGER
  })
  discountId: number;


  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER
  })
  userId:  number;

  @Column({
    type: DataTypes.STRING
  })
  text: string;

  @Column({
    type: DataTypes.INTEGER
  })
  rating: number;

  @Column({
    type: DataTypes.STRING
  })
  photo: string;

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Discount)
  dicount: Discount
}
