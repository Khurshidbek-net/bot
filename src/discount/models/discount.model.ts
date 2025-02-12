import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Store } from "../../store/models/store.entity";
import { DiscountType } from "../../discount-type/models/discount-type.model";
import { Category } from "../../category/models/category.model";
import { Phone } from "nestjs-telegraf";
import { Photo } from "../../photo/models/photo.entity";
import { Favourite } from "../../favourite/models/favourite.entity";
import { Review } from "../../review/models/review.entity";

interface IDiscountCreationAttr {
  storeId: number;
  title: string;
  description: string;
  discountPercent: number;
  startDate: Date;
  endDate: Date;
  categoryId: number;
  discountValue: number;
  specialLink: string;
  isActive: boolean;
  discountTypeId: number;
}

@Table({tableName: "discount"})
export class Discount extends Model<Discount, IDiscountCreationAttr> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => Store)
  @Column({
    type: DataTypes.INTEGER
  })
  storeId: number;

  @Column({
    type: DataTypes.STRING
  })
  title: string;

  @Column({
    type: DataTypes.STRING
  })
  description: string;

  @Column({
    type: DataTypes.INTEGER
  })
  discountPercent: number;

  @Column({
    type: DataTypes.DATE
  })
  startDate: Date;

  @Column({
    type: DataTypes.DATE
  })
  endDate: Date;

  @ForeignKey(() => Category)
  @Column({
    type: DataTypes.INTEGER
  })
  categoryId: number;

  @Column({
    type: DataTypes.INTEGER
  })
  discountValue: number;

  @Column({
    type: DataTypes.STRING
  })
  specialLink: string;

  @Column({
    type: DataTypes.BOOLEAN
  })
  isActive: boolean;

  @ForeignKey(() => DiscountType)
  @Column({
    type: DataTypes.INTEGER
  })
  discountTypeId: number;


  @BelongsTo(() => DiscountType)
  discountType: DiscountType

  @BelongsTo(() => Category)
  category: Category

  @HasMany(() => Favourite)
  favourite: Favourite[]

  @BelongsTo(() => Store)
  store: Store

  @HasMany(() => Photo)
  photos: Photo

  @HasMany(() => Review)
  reviews: Review[]
}
