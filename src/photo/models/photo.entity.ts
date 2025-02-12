import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface IPhotoCreationAttr {
  url: string;
  discountId: number;
}

@Table({tableName: 'photo'})
export class Photo extends Model<Photo, IPhotoCreationAttr> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.STRING
  })
  url: string;

  @ForeignKey(() => Discount)
  @Column({
    type: DataTypes.INTEGER
  })
  discountId: number;

  @BelongsTo(() => Discount)
  dicount: Discount
}
