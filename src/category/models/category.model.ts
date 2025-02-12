import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

interface ICategoryCreationAttr {
  name: string;
  description: string;
  parentCategoryId: number;
}


@Table({ tableName: "category" })
export class Category extends Model<Category, ICategoryCreationAttr> {
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

  @ForeignKey(() => Category)
  @Column({
    type:DataType.INTEGER,
    onDelete: 'Restrict'
  })
  parentCategoryId:number;


  @BelongsTo(() => Category)
  category: Category

  @HasMany(() => Category)
  categories: Category[]
}
