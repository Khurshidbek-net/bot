import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";
import { User } from "../../user/models/user.model";

interface IFavouriteCreationAttr {
  userId: number;
  discountId: number;
}


@Table({tableName: 'favourite'})
export class  Favourite extends Model<Favourite, IFavouriteCreationAttr> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER
  })
  userId: number;

  @ForeignKey(() => Discount)
  @Column({
    type: DataTypes.INTEGER
  })
  discountId: number;

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Discount)
  discounts: Discount
}
