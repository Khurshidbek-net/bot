import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Store } from "../../store/models/store.entity";

interface CreationAttr {
  userId: number;
  storeId: number;
}


@Table({ tableName: 'storeSubscribe'})
export class StoreSubscribe extends Model<StoreSubscribe, CreationAttr> {
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

  @ForeignKey(() => Store)
  @Column({
    type: DataTypes.INTEGER
  })
  storeId: number;

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Store)
  store: Store
}
