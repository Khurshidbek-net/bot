import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface IDiscountCreationAttb {
  name: string;
  description: string;
}




@Table({ tableName: "discountType" })
export class DiscountType extends Model<DiscountType, IDiscountCreationAttb> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING
  })
  name: string;

  @Column({
    type: DataType.STRING
  })
  description: string;

  @HasMany(() => Discount)
  discounts: Discount[]
}
